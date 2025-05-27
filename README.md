# Kantin Rumah Kayu ITERA

Aplikasi web untuk sistem pemesanan makanan di Kantin Rumah Kayu ITERA. Proyek ini menggunakan React + Vite untuk frontend dan Python Pyramid untuk backend.

## Prasyarat Sistem

Pastikan sistem Anda telah menginstall software berikut:

### 1. Node.js dan npm
- **Node.js** versi 16 atau lebih baru
- **npm** (biasanya sudah termasuk dengan Node.js)
- Download dari: https://nodejs.org/

### 2. Python
- **Python** versi 3.8 atau lebih baru
- **pip** (package manager Python)
- Download dari: https://python.org/

### 3. PostgreSQL
- **PostgreSQL** database server
- Download dari: https://postgresql.org/
- Pastikan service PostgreSQL berjalan di port 5432

## Instalasi dan Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd Arya-Pratama-122140156-Kantin-Rumah-Kayu-ITERA
```

### 2. Setup Database PostgreSQL
1. Buka PostgreSQL dan buat database baru:
```sql
CREATE DATABASE kantin_rk;
```
2. Buat user dengan password (sesuai konfigurasi di `backend/backend/development.ini`):
```sql
CREATE USER postgres WITH PASSWORD 'Admin123';
GRANT ALL PRIVILEGES ON DATABASE kantin_rk TO postgres;
```

### 3. Setup Backend (Python Pyramid)
```bash
# Masuk ke direktori backend
cd backend/backend

# Install dependencies Python
pip install -e .

# Install driver PostgreSQL
pip install psycopg2-binary

# Jalankan migrasi database (jika ada)
alembic upgrade head
```

### 4. Setup Frontend (React + Vite)
```bash
# Masuk ke direktori frontend
cd frontend

# Install dependencies Node.js
npm install --legacy-peer-deps
```

## Menjalankan Aplikasi

### 1. Menjalankan Backend Server
```bash
# Dari direktori backend/backend
cd backend/backend
pserve development.ini --reload
```
Backend akan berjalan di: **http://127.0.0.1:6543**

### 2. Menjalankan Frontend Server
```bash
# Dari direktori frontend (buka terminal baru)
cd frontend
npm run dev
```
Frontend akan berjalan di: **http://localhost:5173**

## Struktur Proyek

```
├── frontend/          # Aplikasi React + Vite
│   ├── src/
│   │   ├── components/    # Komponen React
│   │   ├── pages/         # Halaman aplikasi
│   │   └── assets/        # File statis
│   ├── package.json       # Dependencies frontend
│   └── vite.config.js     # Konfigurasi Vite
│
├── backend/           # Aplikasi Python Pyramid
│   └── backend/
│       ├── backend/       # Source code backend
│       │   ├── models/    # Model database
│       │   ├── views/     # Controller/Views
│       │   └── templates/ # Template HTML
│       ├── setup.py       # Dependencies backend
│       └── development.ini # Konfigurasi server
│
└── README.md          # File ini
```

## Troubleshooting

### Error: "Cannot find package 'vite'"
```bash
cd frontend
npm install --legacy-peer-deps
```

### Error: "pserve command not found"
```bash
cd backend/backend
pip install -e .
```

### Error: "No module named 'psycopg2'"
```bash
pip install psycopg2-binary
```

### Error: Database connection failed
1. Pastikan PostgreSQL service berjalan
2. Periksa konfigurasi database di `backend/backend/development.ini`
3. Pastikan database `kantin_rk` sudah dibuat

## Teknologi yang Digunakan

### Frontend
- **React 19** - Library JavaScript untuk UI
- **Vite** - Build tool dan dev server
- **Material-UI** - Komponen UI
- **Tailwind CSS** - Framework CSS
- **React Router** - Routing aplikasi

### Backend
- **Python Pyramid** - Web framework Python
- **SQLAlchemy** - ORM untuk database
- **PostgreSQL** - Database relational
- **Alembic** - Database migration tool

## Kontributor

- Arya Pratama (122140156)
- Institut Teknologi Sumatera (ITERA)
