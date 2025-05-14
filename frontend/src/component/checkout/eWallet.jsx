import { 
    Box, 
    Grid, 
    Button, 
    TextField, 
    Typography, 
    InputAdornment 
} from '@mui/material';
import { Phone } from '@mui/icons-material';

const Ewallet = ({ selected, onSelect, number, onNumberChange }) => {
    const options = ["Dana", "ShopeePay", "GoPay", "OVO"];
    const colors = {
        "Dana": "bg-blue-50 text-blue-600 border-blue-200",
        "ShopeePay": "bg-green-500 text-white border-green-400",
        "GoPay": "bg-gray-50 text-gray-600 border-gray-200",
        "OVO": "bg-gray-50 text-gray-600 border-gray-200",
    };
  
    return (
        <div>
            <div className="grid grid-cols-2 gap-3 mb-5">
                {options.map((method) => (
                    <button
                        key={method}
                        onClick={() => onSelect(method)}
                        className={`
                            px-4 py-3 rounded-lg border text-center transition-colors
                            ${selected === method 
                                ? colors[method] 
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}
                        `}
                    >
                        {method}
                    </button>
                ))}
            </div>
    
            {selected && (
                <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-1.5">
                        Masukkan nomor {selected}
                    </label>
                    <input
                        type="text"
                        placeholder="08xxxxxxxxxx"
                        value={number}
                        onChange={(e) => onNumberChange(e.target.value)}
                        className="w-full rounded-lg bg-gray-50 px-4 py-3.5 focus:outline-none border border-gray-200 focus:border-green-300 focus:ring-1 focus:ring-green-300 transition-colors"
                    />
                </div>
            )}
        </div>
    );
};
  
export default Ewallet;