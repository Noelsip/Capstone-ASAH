# Predictive Maintenance Backend

Backend service untuk aplikasi Predictive Maintenance Copilot menggunakan Node.js, Prisma ORM, dan PostgreSQL.

## 📋 Prerequisites

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) (v18 atau lebih baru)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd capstone-project/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root folder backend:

```bash
cp .env.example .env
```

Atau buat manual dengan isi:

```env
DATABASE_URL="postgresql://capstone_user:accenturer25@localhost:5434/capstone_db?schema=public"
```

### 4. Start Database dengan Docker

```bash
docker-compose up -d
```

Verifikasi database sudah running:

```bash
docker ps
```

Output seharusnya menampilkan container `capstone_postgres` dengan status `Up`.

### 5. Run Database Migration

```bash
npm run migrate
```

Perintah ini akan:
- Membuat semua tabel di database
- Apply semua schema dari `prisma/schema.prisma`
- Generate Prisma Client di `src/generated/prisma`

### 6. Verifikasi Database (Opsional)

Buka Prisma Studio untuk melihat database:

```bash
npm run prisma:studio
```

Akan terbuka di browser: `http://localhost:5555`

## 📦 Available Scripts

| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Jalankan development server dengan hot reload |
| `npm start` | Jalankan production server |
| `npm run migrate` | Jalankan database migration |
| `npm run prisma:studio` | Buka Prisma Studio (database GUI) |
| `npm run postinstall` | Generate Prisma Client (otomatis dijalankan setelah install) |

## 🗄️ Database Schema

Database terdiri dari 15 tabel utama:

### Core Tables
- **ROLES** - Role pengguna (Admin, Technician, etc)
- **USERS** - Data pengguna sistem
- **PRODUCT_TYPES** - Tipe produk mesin
- **MACHINES** - Data mesin yang dimonitor
- **FAILURE_TYPES** - Jenis kegagalan mesin

### Monitoring & Prediction
- **SENSOR_READINGS** - Data sensor dari mesin
- **INFERENCE_JOBS** - Job untuk prediksi ML
- **PREDICTIONS** - Hasil prediksi kegagalan

### Alert Management
- **ALERTS** - Alert yang dihasilkan sistem
- **ALERT_ACKNOWLEDGEMENTS** - Konfirmasi alert
- **ALERT_ASSIGNMENTS** - Penugasan alert ke user
- **ALERT_RESOLUTIONS** - Penyelesaian alert
- **ALERT_HISTORY** - History perubahan alert

### Maintenance & Chat
- **MAINTENANCE_LOGS** - Log maintenance mesin
- **CHAT_CONVERSATIONS** - Percakapan dengan AI
- **CHAT_MESSAGES** - Pesan dalam chat
- **CHAT_MESSAGE_CONTEXT** - Context untuk AI chat

## 🐳 Docker Commands

### Start Database
```bash
docker-compose up -d
```

### Stop Database
```bash
docker-compose down
```

### Stop & Remove Data (Reset database)
```bash
docker-compose down -v
```

### View Logs
```bash
docker-compose logs -f postgres
```

### Access PostgreSQL CLI
```bash
docker exec -it capstone_postgres psql -U capstone_user -d capstone_db
```

## 🔧 Troubleshooting

### Error: Port 5434 already in use

```bash
# Cek proses yang menggunakan port 5434
netstat -ano | findstr :5434

# Stop container lain yang menggunakan port tersebut
docker ps
docker stop <container_id>
```

### Error: Migration failed

```bash
# Reset database dan migration
docker-compose down -v
docker-compose up -d

# Tunggu 10 detik agar PostgreSQL siap
timeout /t 10

# Hapus migration folder
rm -rf prisma/migrations

# Buat migration baru
npm run migrate
```

### Error: DATABASE_URL not found

Pastikan file `.env` ada dan berisi:
```env
DATABASE_URL="postgresql://capstone_user:accenturer25@localhost:5434/capstone_db?schema=public"
```

### Error: Prisma Client tidak ditemukan

```bash
npx prisma generate
```