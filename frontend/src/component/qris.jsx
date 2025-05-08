import React from "react";
import QrisImage from "../assets/qris.jpg";

const Qris = () => {
    return (
        <div className="mb-6 text-center">
            <p className="mb-2 text-gray-700 font-medium">
                Silakan scan QR berikut untuk pembayaran
            </p>
            <img
                src={QrisImage}
                alt="QRIS"
                className="w-48 h-48 mx-auto rounded-xl shadow-md border"
            />
        </div>
    );
};

export default Qris;