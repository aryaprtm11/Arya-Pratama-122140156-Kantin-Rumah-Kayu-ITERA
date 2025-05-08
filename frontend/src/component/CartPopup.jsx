import { useCart } from "../pages/cart";
import { useNavigate } from "react-router-dom";

const CartPopup = () => {
    const { cartItems, closeCart, isCartOpen } = useCart();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

    const handleCheckout = () => {
        closeCart();
        navigate("/checkout");
    };

    return (
        <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
        onClick={closeCart}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-96 max-w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Keranjang</h2>
                    <button
                        onClick={closeCart}
                        className="text-red-500 text-4xl font-bold hover:scale-110"
                    >
                        ×
                    </button>
                </div>

                {cartItems.length === 0 ? (
                <p className="text-gray-500">
                    Keranjang kosong, silahkan pilih menu terlebih dahulu
                </p>
                ) : (
                    <>
                        <ul className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                            {cartItems.map((item, index) => (
                                <li key={index} className="border-b pb-2">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-gray-600">
                                        Rp{" "}
                                        {Number(item.price).toLocaleString("id-ID", {
                                        minimumFractionDigits: 2,
                                        })}
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="flex justify-between items-center mb-4 text-lg font-semibold">
                            <span>Total:</span>
                            <span>
                                Rp{" "}
                                {Number(total).toLocaleString("id-ID", {
                                minimumFractionDigits: 2,
                                })}
                            </span>
                        </div>

                        <button
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-semibold transition"
                        onClick={handleCheckout}
                        >
                        Pembayaran
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPopup;