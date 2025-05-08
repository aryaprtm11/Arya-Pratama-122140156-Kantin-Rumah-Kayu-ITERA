const SearchInput = ({ value, onChange }) => (
    <input
        type="text"
        placeholder="Cari menu..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3"
    />
)
  
export default SearchInput  