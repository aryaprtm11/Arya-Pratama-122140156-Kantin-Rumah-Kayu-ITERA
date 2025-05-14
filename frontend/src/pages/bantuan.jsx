import { useCart } from "./cart";
import Navbar from "../component/shared/Navbar";
import { Box } from '@mui/material';

const Bantuan = () => {
  const { toggleCart } = useCart();

  return (
    <Box className="bg-[#FDFAF6] min-h-screen font-poppins">
        <Navbar toggleCart={toggleCart} activePage="bantuan" />

        <main className="pt-[140px] sm:pt-[150px] px-4 md:px-8 lg:px-12 pb-12 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#2E4F4F] mb-8 text-center">Pusat Bantuan</h2>

            <div className="text-gray-700 text-lg mb-10 text-center">
                <p>
                    Jika Anda mengalami kesulitan saat melakukan pemesanan di Kantin Rumah Kayu ITERA,
                    berikut adalah beberapa hal yang dapat Anda lakukan:
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    {
                    title: "Tidak bisa menambahkan item ke keranjang",
                    desc: "Pastikan koneksi internet Anda stabil. Jika masalah berlanjut, coba muat ulang halaman.",
                    },
                    {
                    title: "Keranjang kosong setelah menambahkan menu",
                    desc: "Periksa apakah Anda sudah menekan tombol 'Tambah ke Keranjang' dengan benar. Coba refresh halaman.",
                    },
                    {
                    title: "Tidak bisa lanjut ke halaman checkout",
                    desc: "Pastikan Anda sudah memilih minimal satu item sebelum checkout. Jika masih gagal, coba buka ulang halaman.",
                    },
                    {
                    title: "Masalah saat memilih metode pembayaran",
                    desc: "Pastikan Anda memilih salah satu metode (QRIS atau E-Wallet) dan mengisi informasi yang diminta.",
                    },
                    {
                    title: "QRIS tidak tampil",
                    desc: "QR akan muncul setelah memilih metode QRIS. Jika tidak tampil, periksa koneksi dan muat ulang halaman.",
                    },
                ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl shadow p-5 border border-gray-200">
                    <h3 className="font-semibold text-green-600 mb-2">{item.title}</h3>
                    <p className="text-gray-700 text-base">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-gray-700 text-left text-lg">
                <p>
                    Jika masalah Anda belum terselesaikan, silakan hubungi tim kami melalui email di{" "}
                    <a href="mailto:rumahkayu@itera.ac.id" className="text-green-600 underline">rumahkayu@itera.ac.id</a>{" "}
                    atau datang langsung ke lokasi kantin untuk bantuan langsung.
                </p>
            </div>
        </main>
    </Box>
  );
};

export default Bantuan;