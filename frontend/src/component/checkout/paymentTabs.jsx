import React from "react";

const PaymentTabs = ({ paymentMethod, setPaymentMethod, resetEwallet }) => {
    return (
        <div className="mb-5 flex bg-gray-100 p-1 rounded-lg">
            <button
                className={`flex-1 py-2 text-center rounded-lg ${
                paymentMethod === "ewallet"
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-500"
                }`}
                onClick={() => setPaymentMethod("ewallet")}
            >
                <span className="flex items-center justify-center gap-1.5 text-sm">
                    <span>🔒</span> E-Wallet
                </span>
            </button>
            <button
                className={`flex-1 py-2 text-center rounded-lg ${
                paymentMethod === "qris"
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-500"
                }`}
                onClick={() => {
                setPaymentMethod("qris");
                resetEwallet();
                }}
            >
                <span className="flex items-center justify-center gap-1.5 text-sm">
                    <span>📱</span> QRIS
                </span>
            </button>
        </div>
    );
};

export default PaymentTabs; 