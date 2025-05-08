import IteraLogo from "../assets/itera.png";
import BurgerMenu from "../component/BurgerMenu";
import { useCart } from "./cart";

const Bantuan = () => {
  const { toggleCart } = useCart();

  return (
    <div className="bg-[#FDFAF6] min-h-screen font-poppins">
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#E4EFE7] p-6 py-6 shadow-lg rounded-b-xl">
            <div className="flex justify-between items-center w-full px-6">
                <div className="flex items-center gap-4">
                    <img src={IteraLogo} alt="Logo Itera" className="h-10 w-auto" />
                    <h1
                    className="navbar-title font-semibold text-xl sm:text-2xl md:text-3xl ml-2"
                    style={{ fontFamily: "Times New Roman, Times, serif" }}
                    >
                    Kantin Rumah Kayu ITERA
                    </h1>
                </div>

                <ul className="hidden md:flex items-center gap-6 text-sm sm:text-base md:text-lg">
                    <li>
                        <a
                            href="/"
                            className="font-medium hover:bg-green-500 rounded-xl hover:text-white px-5 py-2"
                        >
                            Beranda
                        </a>
                    </li>
                    <li>
                        <a
                            href="/order"
                            className="font-medium hover:bg-green-500 rounded-xl hover:text-white px-5 py-2"
                        >
                            Menu
                        </a>
                    </li>
                    <li>
                        <a
                            href="/bantuan"
                            className="font-medium hover:bg-green-500 rounded-xl hover:text-white px-5 py-2"
                        >
                            Bantuan
                        </a>
                    </li>
                </ul>
                <BurgerMenu toggleCart={toggleCart} />
            </div>
        </nav>

        <main className="pt-[140px] px-6 md:px-12 pb-12 max-w-6xl mx-auto">
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
    </div>
  );
};

export default Bantuan;