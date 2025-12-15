import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validasi input
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email dan password harus diisi'
            })
        }

        // Cek user berdasarkan email
        const user = await prisma.uSERS.findUnique({
            where: {
                user_email: email
            },
            include: {
                role: true
            }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Email atau password salah'
            });
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.user_pass);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Email atau password salah'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.user_email,
                role: user.role.role_name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1d'
            }
        );

        // Update last_login
        await prisma.uSERS.update({
            where: {
                id: user.id
            },
            data: {
                last_login: new Date()
            }
        })
        
        // Simpan token di cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 hari
        });

        return res.status(200).json({
            message: 'Login berhasil',
            user: {
                "id": user.id,
                "name": user.name,
                "user_email": user.user_email,
                "is_active": user.is_active,
                "created_at": user.created_at,
            },
            token
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            error: 'Terjadi kesalahan saat login'
        });
    }
}

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const user = await prisma.uSERS.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                name: true,
                user_email: true,
                is_active: true,
                created_at: true,
                last_login: true,
                role: {
                    select: {
                        role_name: true,
                        role_desc: true,
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({
                error: 'User tidak ditemukan'
            })
        }

        return res.status(200).json({
            message: 'Profile berhasil diambil',
            user
        })
    } catch (error) {
        console.error('Error during get profile:', error);
        return res.status(500).json({
            error: 'Terjadi kesalahan saat mengambil profile'
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Validasi input - minimal ada satu field yang diupdate
        if (!name && !email && !newPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Tidak ada data yang akan diupdate'
            });
        }

        // Jika update email, cek apakah email sudah digunakan
        if (email && email !== req.user.email) {
            const existingUser = await prisma.uSERS.findUnique({
                where: { user_email: email.trim().toLowerCase() }
            });

            if (existingUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email sudah digunakan oleh user lain'
                });
            }
        }

        // Jika update password, verifikasi password lama
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Password lama harus diisi untuk mengubah password'
                });
            }

            // Validasi panjang password baru (PINDAHKAN KE DALAM IF newPassword)
            if (newPassword.length < 8) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Password baru minimal 8 karakter'
                });
            }

            // Get user dengan password
            const user = await prisma.uSERS.findUnique({
                where: { id: userId }
            });

            // Verifikasi password lama
            const isPasswordValid = await bcrypt.compare(currentPassword, user.user_pass);
            if (!isPasswordValid) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Password lama tidak sesuai'
                });
            }
        }

        // Prepare data untuk update (HANYA field yang ada di schema USERS)
        const updateData = {};
        
        if (name) updateData.name = name.trim();
        if (email) updateData.user_email = email.trim().toLowerCase();
        
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.user_pass = hashedPassword;
        }

        // Update user
        const updatedUser = await prisma.uSERS.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                user_email: true,
                is_active: true,
                created_at: true,
                last_login: true,
                role: {
                    select: {
                        role_name: true,
                        role_desc: true
                    }
                }
            }
        });

        return res.status(200).json({
            status: 'success',
            message: 'Profile berhasil diupdate',
            data: updatedUser
        });

    } catch (error) {
        console.error('Error during update profile:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan saat mengupdate profile'
        });
    }
};

// Helper function untuk mendapatkan default role
async function getDefaultRoleId() {
    const defaultRole = await prisma.rOLES.findFirst({
        where: {
            role_name: 'user'
        }
    });

    if (!defaultRole) {
        throw new Error('Role default tidak ditemukan');
    }

    return defaultRole.id;
}

export default {
    login,
    getProfile,
    getDefaultRoleId,
    updateProfile
}