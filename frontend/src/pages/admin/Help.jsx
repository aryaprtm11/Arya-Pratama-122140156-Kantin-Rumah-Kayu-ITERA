import React from 'react';
import AdminSidebar from '../../component/admin/AdminSidebar';

const Help = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar activeMenu="bantuan" />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Halaman Bantuan Admin</h1>
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Panduan Penggunaan Dashboard</h2>
          <p className="mb-4">
            Selamat datang di halaman bantuan untuk admin dashboard Kantin Rumah Kayu ITERA.
            Di halaman ini, Anda dapat menemukan panduan dan informasi penting untuk mengelola
            pesanan, menu, pengguna, dan fitur lainnya.
          </p>
          <h3 className="text-lg font-semibold mb-2">Manajemen Pesanan</h3>
          <p className="mb-4">
            Pada halaman manajemen pesanan, Anda dapat melihat daftar pesanan terbaru, mengubah status pesanan,
            dan memproses pesanan sesuai kebutuhan.
          </p>
          <h3 className="text-lg font-semibold mb-2">Manajemen Menu</h3>
          <p className="mb-4">
            Halaman manajemen menu memungkinkan Anda menambah, mengedit, dan menghapus menu yang tersedia
            di kantin. Pastikan data menu selalu diperbarui agar pelanggan mendapatkan informasi yang akurat.
          </p>
          <h3 className="text-lg font-semibold mb-2">Manajemen Pengguna</h3>
          <p className="mb-4">
            Di halaman manajemen pengguna, Anda dapat melihat daftar pengguna terdaftar, mengubah peran,
            dan mengelola status akun pengguna.
          </p>
          <h3 className="text-lg font-semibold mb-2">Kontak dan Dukungan</h3>
          <p>
            Jika Anda mengalami kendala atau membutuhkan bantuan lebih lanjut, silakan hubungi tim IT Kantin Rumah Kayu ITERA.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Help;
