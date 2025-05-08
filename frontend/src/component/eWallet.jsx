const Ewallet = ({ selected, onSelect, number, onNumberChange }) => {
    const options = ["Dana", "ShopeePay", "GoPay", "OVO"];
  
    return (
        <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
                {options.map((method) => (
                    <button
                    key={method}
                    onClick={() => onSelect(method)}
                    className={`border rounded-xl py-3 text-center font-medium ${
                        selected === method ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700"
                    } hover:bg-green-100 transition`}
                    >
                    {method}
                    </button>
                ))}
            </div>
    
            {selected && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Masukkan nomor {selected}
                    </label>
                    <input
                    type="text"
                    placeholder="08xxxxxxxxxx"
                    value={number}
                    onChange={(e) => onNumberChange(e.target.value)}
                    className="w-full rounded-xl bg-gray-100 px-4 py-3 focus:outline-none"
                    />
                </div>
            )}
        </div>
    );
  };
  
  export default Ewallet;