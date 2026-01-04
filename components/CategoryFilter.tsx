import { FaTag, FaChevronRight } from 'react-icons/fa';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const allCategories = ['all', ...categories];
  
  const categoryIcons: Record<string, React.ReactNode> = {
    all: <FaTag className="mr-3" />,
    electronics: <span className="mr-3 text-xl">📱</span>,
    jewelery: <span className="mr-3 text-xl">💎</span>,
    "men's clothing": <span className="mr-3 text-xl">👕</span>,
    "women's clothing": <span className="mr-3 text-xl">👗</span>,
  };

  const categoryNames: Record<string, string> = {
    'all': 'All Categories',
    'electronics': 'Electronics',
    'jewelery': 'Jewelry',
    "men's clothing": "Men's Clothing",
    "women's clothing": "Women's Clothing",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
        <FaTag className="mr-2" />
        Categories
      </h3>
      
      <div className="space-y-2">
        {allCategories.map((category) => {
          const isSelected = selectedCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center">
                {categoryIcons[category] || <FaTag className="mr-3" />}
                <span className="font-medium">{categoryNames[category] || category}</span>
              </div>
              
              {isSelected && (
                <FaChevronRight className="text-blue-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Price Range Filter (optional) */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Price Range</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>$0</span>
              <span>$1000</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              defaultValue="500"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Featured</h4>
        <div className="space-y-3">
          {['electronics', "men's clothing", "women's clothing"].map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className="w-full text-left p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 transition-all"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">
                  {categoryNames[category]}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Hot
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;