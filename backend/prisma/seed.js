import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // Membuat role
    const adminRole = await prisma.rOLES.upsert({
        where: {
            id:'00000000-0000-0000-0000-000000000001'
        },
        update: {},
        create: {
            id:'00000000-0000-0000-0000-000000000001',
            role_name: 'ADMIN',
            role_desc: 'Administrator dengan akses penuh'
        }
    });

    const technicianRole = await prisma.rOLES.upsert({
        where: {
            id: '00000000-0000-0000-0000-000000000002'
        },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000002',
            role_name: 'TECHNICIAN',
            role_desc: 'Teknisi Maintenance'
        }
    });

    const userRole = await prisma.rOLES.upsert({
        where: {
            id: '00000000-0000-0000-0000-000000000003'
        },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000003',
            role_name: 'USER',
            role_desc: 'User biasa'
        }
    });

    console.log('Roles Created:', {adminRole, technicianRole, userRole})

    // Membuat user
    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminUser = await prisma.uSERS.upsert({
        where: {
            user_email: "admin@gmail.com"
        },
        update: {},
        create: {
            name: 'Admin User',
            user_email: 'admin@gmail.com',
            user_pass: hashedPassword,
            role_id: adminRole.id,
            is_active: true
        }
    });

    const techUser = await prisma.uSERS.upsert({
        where: {
            user_email: 'tech1@gmail.com'
        },
        update: {},
        create: {
            name: 'Technician User',
            user_email: 'tech1@gmail.com',
            user_pass: hashedPassword,
            role_id: technicianRole.id,
            is_active: true
        }
    });

    const normalUser = await prisma.uSERS.upsert({
        where: {
            user_email: 'user1@gmail.com'
        },
        update: {},
        create: {
            name: 'Normal User',
            user_email: 'user1@gmail.com',
            user_pass: hashedPassword,
            role_id: userRole.id,
            is_active: true
        }
    });
    
    console.log(
        'Users Created:', {
            admin: adminUser.user_email,
            technician: techUser.user_email,
            user: normalUser.user_email
        }
    );

    console.log('🎉 Seeding completed!');
    console.log('\n📝 Test credentials:');
    console.log('Admin:', adminUser.user_email, adminUser.user_password);
    console.log('Technician:', techUser.user_email, techUser.user_password);
    console.log('User:', normalUser.user_email, normalUser.user_password);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });