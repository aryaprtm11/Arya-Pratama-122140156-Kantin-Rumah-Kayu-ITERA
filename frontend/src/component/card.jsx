import { useCart } from "../pages/cart";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-all duration-300 hover:scale-105 hover:shadow-xl relative">
      <div className="relative flex justify-center pt-3 pb-2">
        <div className="rounded-full w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 overflow-hidden border-4 border-gray-100 flex items-center justify-center bg-white shadow-md">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-grow text-center">
        <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-1 sm:mb-2 line-clamp-2 text-gray-800">{name}</h3>
        <div className="mt-auto flex justify-between items-center pt-1 sm:pt-2 md:pt-3">
          <div className="text-sm sm:text-base md:text-lg font-bold text-gray-700">
            Rp{price}
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center bg-green-500 text-white w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full hover:bg-green-600 transition-colors"
          >
            <FaPlus className="text-xs sm:text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;