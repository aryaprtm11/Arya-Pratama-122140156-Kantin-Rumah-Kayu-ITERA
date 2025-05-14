import { Chip, Box } from '@mui/material';

const CategoryFilter = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            selected === category
              ? "bg-green-500 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-green-50 hover:border-green-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;  