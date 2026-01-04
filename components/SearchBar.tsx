import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search products...", className = "" }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/products?search=${encodeURIComponent(query)}`);
      }
      setQuery('');
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className={`relative flex items-center transition-all duration-300 ${
          isFocused ? 'ring-2 ring-blue-500' : ''
        }`}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 bg-white shadow-sm"
          />
          
          <div className="absolute left-4 text-gray-400">
            <FaSearch />
          </div>
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions (optional) */}
      {query && isFocused && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-2">Quick search suggestions:</div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  router.push(`/products?search=${encodeURIComponent(query)}`);
                  setQuery('');
                }}
                className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Search for "{query}"
              </button>
              <button
                onClick={() => {
                  router.push(`/products?category=electronics&search=${encodeURIComponent(query)}`);
                  setQuery('');
                }}
                className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                "{query}" in Electronics
              </button>
              <button
                onClick={() => {
                  router.push(`/products?category=jewelery&search=${encodeURIComponent(query)}`);
                  setQuery('');
                }}
                className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                "{query}" in Jewelry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;