import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

const productTypes = [
    { id: 1, type_code: 'A', type_name: 'Tipe A', type_desc: 'Deskripsi tipe A' },
    { id: 2, type_code: 'B', type_name: 'Tipe B', type_desc: 'Deskripsi tipe B' }
];

const machines = [
    { serial: 'SN-001', product_id: 'P001', product_type_id: 1, name: 'Mesin 1', location: 'Plant 1', status: 'active' },
    { serial: 'SN-002', product_id: 'P002', product_type_id: 1, name: 'Mesin 2', location: 'Plant 1', status: 'active' },
    { serial: 'SN-003', product_id: 'P003', product_type_id: 2, name: 'Mesin 3', location: 'Plant 2', status: 'inactive' },
    { serial: 'SN-004', product_id: 'P004', product_type_id: 2, name: 'Mesin 4', location: 'Plant 2', status: 'active' },
    { serial: 'SN-005', product_id: 'P005', product_type_id: 2, name: 'Mesin 5', location: 'Plant 3', status: 'active' },
    { serial: 'SN-006', product_id: 'P006', product_type_id: 2, name: 'Mesin 6', location: 'Plant 3', status: 'active' },
    { serial: 'SN-007', product_id: 'P007', product_type_id: 2, name: 'Mesin 7', location: 'Plant 5', status: 'active' },
    { serial: 'SN-008', product_id: 'P008', product_type_id: 2, name: 'Mesin 8', location: 'Plant 5', status: 'active' },
    { serial: 'SN-009', product_id: 'P009', product_type_id: 1, name: 'Mesin 9', location: 'Plant 6', status: 'active' },
    { serial: 'SN-010', product_id: 'P010', product_type_id: 1, name: 'Mesin 10', location: 'Plant 6', status: 'active' },
];

async function main() {
    console.log("Seeding database...");

    // Seed PRODUCT_TYPES terlebih dahulu
    for (const pt of productTypes) {
        await prisma.pRODUCT_TYPES.upsert({
            where: { id: pt.id },
            update: {},
            create: pt
        });
    }

    // Seed ROLES
    const adminRole = await prisma.rOLES.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            role_name: 'ADMIN',
            role_desc: 'Administrator dengan akses penuh'
        }
    });

    const technicianRole = await prisma.rOLES.upsert({
        where: { id: '00000000-0000-0000-0000-000000000002' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000002',
            role_name: 'TECHNICIAN',
            role_desc: 'Teknisi Maintenance'
        }
    });

    const userRole = await prisma.rOLES.upsert({
        where: { id: '00000000-0000-0000-0000-000000000003' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000003',
            role_name: 'USER',
            role_desc: 'User biasa'
        }
    });

    console.log('Roles Created:', { adminRole, technicianRole, userRole });

    // Seed USERS
    const hashedPassword = await bcrypt.hash('Password123', 10);

    const adminUser = await prisma.uSERS.upsert({
        where: { user_email: "admin@gmail.com" },
        update: { user_pass: hashedPassword },
        create: {
            name: 'Admin User',
            user_email: 'admin@gmail.com',
            user_pass: hashedPassword,
            role_id: adminRole.id,
            is_active: true
        }
    });

    const techUser = await prisma.uSERS.upsert({
        where: { user_email: 'tech1@gmail.com' },
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
        where: { user_email: 'user1@gmail.com' },
        update: {},
        create: {
            name: 'Normal User',
            user_email: 'user1@gmail.com',
            user_pass: hashedPassword,
            role_id: userRole.id,
            is_active: true
        }
    });

    // Seed MACHINES
    for (const m of machines) {
        await prisma.mACHINES.upsert({
            where: { serial: m.serial },
            update: {},
            create: m
        });
    }

    console.log('Users Created:', {
        admin: adminUser.user_email,
        technician: techUser.user_email,
        user: normalUser.user_email
    });

    console.log('🎉 Seeding completed!');
    console.log('\n📝 Test credentials:');
    console.log('Admin:', adminUser.user_email, '/ Password123');
    console.log('Technician:', techUser.user_email, '/ Password123');
    console.log('User:', normalUser.user_email, '/ Password123');
    console.log('Seeded Machines!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });