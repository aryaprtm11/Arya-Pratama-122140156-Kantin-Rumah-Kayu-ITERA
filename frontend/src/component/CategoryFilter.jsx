const CategoryFilter = ({ categories, selected, onSelect }) => {
    return (
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`px-4 py-2 rounded-lg border text-sm font-semibold transition ${
              selected === category
                ? "bg-green-500 text-white"
                : "bg-white text-gray-700 border-gray-400"
            } hover:bg-green-100`}
          >
            {category}
          </button>
        ))}
      </div>
    );
  };
  
  export default CategoryFilter;  