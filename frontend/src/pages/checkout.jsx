import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./cart";
import PaymentTabs from "../component/paymentTabs";
import Ewallet from "../component/eWallet";
import Qris from "../component/qris";
import Swal from "sweetalert2";

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState("qris");
    const [selectedEwallet, setSelectedEwallet] = useState(null);
    const [ewalletNumber, setEwalletNumber] = useState("");
    const navigate = useNavigate();
    const { cartItems } = useCart();

    const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

    const handlePayment = () => {
        if (paymentMethod === "ewallet" && (!selectedEwallet || !ewalletNumber)) {
            Swal.fire({
                icon: "warning",
                title: "Lengkapi Informasi",
                text: "Silakan pilih metode e-wallet dan masukkan nomor terlebih dahulu.",
            });
            return;
        }
      
        Swal.fire({
            icon: "success",
            title: "Pembayaran Berhasil!",
            text: "Terima kasih, pesanan Anda sedang diproses.",
            confirmButtonColor: "#22c55e", // green-500
        });
    };      

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-green-100 flex items-center justify-center font-poppins p-4 relative">
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 text-sm bg-white hover:bg-gray-100 text-green-600 border border-green-500 font-medium px-4 py-2 rounded-lg shadow-sm transition"
            >
                ← Kembali
            </button>

            <div className="flex flex-col md:flex-row gap-8 mt-10 w-full max-w-6xl">
                <div className="bg-white rounded-2xl shadow-2xl w-full md:w-1/2 p-6 h-fit">
                    <h3 className="text-xl font-bold mb-4 text-green-600">Rincian Pesanan</h3>
                    {cartItems.length === 0 ? (
                        <p className="text-gray-500">Keranjang kosong.</p>
                    ) : (
                        <ul className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
                        {cartItems.map((item, index) => (
                            <li key={index} className="border-b pb-2">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-600">
                                Rp {Number(item.price).toLocaleString("id-ID", { minimumFractionDigits: 2 })}
                            </div>
                            </li>
                        ))}
                        </ul>
                    )}
                    <div className="flex justify-between text-lg font-semibold mt-4 border-t pt-4">
                        <span>Total:</span>
                        <span>Rp {Number(total).toLocaleString("id-ID", { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl w-full md:w-1/2 p-6">
                    <PaymentTabs
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        resetEwallet={() => {
                        setSelectedEwallet(null);
                        setEwalletNumber("");
                        }}
                    />

                    {paymentMethod === "ewallet" && (
                        <>
                        <Ewallet
                            selected={selectedEwallet}
                            onSelect={setSelectedEwallet}
                            number={ewalletNumber}
                            onNumberChange={setEwalletNumber}
                        />
                        </>
                    )}

                    {paymentMethod === "qris" && <Qris/>}

                    <button
                        onClick={handlePayment}
                        className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-lg font-semibold transition"
                        >
                        Bayar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;