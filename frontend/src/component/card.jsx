import { useCart } from "../pages/cart";
import Swal from "sweetalert2";

function Card({ id, name, image, desc, price }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({ id, name, price });

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: `${name} telah dimasukkan ke keranjang.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className="bg-white w-full max-w-xs rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
      <img
        src={image}
        alt={name}
        className="w-full h-56 object-cover rounded-t-xl"
      />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
          <p className="text-sm text-gray-600 mb-4">{desc}</p>
        </div>
        <div className="text-lg font-semibold text-gray-800 mb-4">
          Harga : Rp {price}
        </div>
        <button
          onClick={handleAdd}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Tambahkan ke Keranjang
        </button>
      </div>
    </div>
  );
}

export default Card;