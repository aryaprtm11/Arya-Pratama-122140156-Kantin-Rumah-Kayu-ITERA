import { FaSearch } from 'react-icons/fa';

const SearchInput = ({ value, onChange }) => (
    <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
        </div>
        <input
            type="text"
            placeholder="Cari menu..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
    </div>
);
  
export default SearchInput; 