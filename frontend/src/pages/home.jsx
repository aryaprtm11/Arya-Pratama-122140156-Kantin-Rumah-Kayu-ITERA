import { useCart } from "./cart";
import IteraLogo from "../assets/itera.png";
import BurgerMenu from "../component/BurgerMenu";
import Kantin from "../assets/Kantin.jpg";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { toggleCart } = useCart();
    const navigate = useNavigate();

    return (
        <>
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

                <main className="pt-[130px] px-6 md:px-12 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
                        <div className="text-center md:text-left">
                            <img
                                src={Kantin}
                                alt="Kantin ITERA"
                                className="w-full rounded-xl shadow-lg"
                            />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-[#2E4F4F] mb-4">Selamat Datang di Rumah Kayu ITERA!</h2>
                            <p className="text-lg text-gray-700 mb-4">
                            Selamat datang di Kantin Rumah Kayu ITERA — tempat di mana cita rasa nusantara berpadu dengan kenyamanan suasana. Kami hadir untuk memberikan pengalaman bersantap yang tak hanya lezat, tetapi juga penuh kehangatan. Dari menu favorit mahasiswa hingga hidangan khas yang menggugah selera, semua disajikan dengan penuh cinta dan kualitas terbaik. Ayo, jelajahi menu kami dan temukan hidangan yang pas untuk menemani harimu!
                            </p>
                            <p className="text-lg text-gray-700 mb-8">
                            Tak peduli apakah kamu sedang mencari sarapan cepat sebelum kuliah, makan siang santai bersama teman, atau camilan sore untuk menemani tugas—kami punya semuanya. Dengan tempat yang nyaman dan harga bersahabat, Rumah Kayu ITERA siap jadi tempat andalanmu setiap hari. Rasakan sendiri kelezatan yang tak hanya memanjakan lidah, tapi juga membuatmu betah berlama-lama!
                            </p>
                            <button 
                            onClick={() => navigate("/order")}
                            className="bg-green-500 hover:bg-green-600 rounded-xl p-4 text-white px-8 font-semibold">
                            Pesan Sekarang 🛒
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Home;