# Kantin Rumah Kayu ITERA

## Judul Aplikasi Web
Sistem Informasi Manajemen Kantin Rumah Kayu ITERA

## Deskripsi Aplikasi Web
Aplikasi web ini adalah sistem manajemen kantin yang dirancang khusus untuk Kantin Rumah Kayu ITERA. Aplikasi ini memungkinkan pengelolaan menu makanan, pemesanan, dan manajemen pengguna secara efisien. Sistem ini memiliki dua role utama: admin untuk mengelola sistem dan pembeli untuk melakukan pemesanan makanan.

## Dependensi Paket (Library)

### Frontend (React.js)
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.x
- react-icons: ^4.x
- tailwindcss: ^3.x
- sweetalert2: ^11.x
- axios: ^1.x

### Backend (Python Pyramid)
- pyramid: ^2.0
- SQLAlchemy: ^1.4
- pyramid_jinja2: ^2.10
- alembic: ^1.x
- bcrypt: ^4.0
- python-jose: ^3.3
- pyramid_jwt: ^1.5
- waitress: ^2.1

## Fitur pada Aplikasi

### Fitur Admin
1. Manajemen Menu
   - Tambah menu baru
   - Edit menu yang ada
   - Hapus menu
   - Lihat daftar menu

2. Manajemen Kategori
   - Tambah kategori menu
   - Edit kategori
   - Hapus kategori
   - Lihat daftar kategori

3. Manajemen Pengguna
   - Tambah pengguna baru
   - Edit data pengguna
   - Hapus pengguna
   - Lihat daftar pengguna

4. Manajemen Pesanan
   - Lihat semua pesanan
   - Update status pesanan
   - Hapus pesanan

### Fitur Pembeli
1. Manajemen Profil
   - Lihat profil
   - Edit profil
   - Ganti password

2. Menu dan Pemesanan
   - Lihat daftar menu
   - Filter menu berdasarkan kategori
   - Tambah menu ke keranjang
   - Checkout pesanan

3. Keranjang Belanja
   - Tambah item ke keranjang
   - Ubah jumlah item
   - Hapus item dari keranjang
   - Checkout keranjang

4. Riwayat Pesanan
   - Lihat riwayat pesanan
   - Lihat detail pesanan
   - Cek status pesanan

## Referensi
1. Dokumentasi React.js: https://reactjs.org/docs
2. Dokumentasi Pyramid: https://docs.pylonsproject.org/projects/pyramid
3. Dokumentasi Tailwind CSS: https://tailwindcss.com/docs
4. Dokumentasi SQLAlchemy: https://docs.sqlalchemy.org
5. Tutorial React dengan Pyramid: https://www.pyramid-tutorial.com
6. Best Practices REST API: https://restfulapi.net
7. Dokumentasi Sweet Alert 2: https://sweetalert2.github.io
8. React Icons Documentation: https://react-icons.github.io/react-icons
