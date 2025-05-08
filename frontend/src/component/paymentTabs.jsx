import React from "react";

const PaymentTabs = ({ paymentMethod, setPaymentMethod, resetEwallet }) => {
    return (
        <div className="flex items-center justify-between mb-6 bg-gray-100 rounded-xl p-1">
            <button
                className={`flex-1 py-2 rounded-xl text-sm font-medium ${
                paymentMethod === "ewallet"
                    ? "bg-white text-black shadow"
                    : "text-gray-500"
                }`}
                onClick={() => setPaymentMethod("ewallet")}
            >
                👜 E-Wallet
            </button>
            <button
                className={`flex-1 py-2 rounded-xl text-sm font-medium ${
                paymentMethod === "qris"
                    ? "bg-green-500 text-white shadow"
                    : "text-gray-500"
                }`}
                onClick={() => {
                setPaymentMethod("qris");
                resetEwallet();
                }}
            >
                📱 QRIS
            </button>
        </div>
    );
};

export default PaymentTabs;