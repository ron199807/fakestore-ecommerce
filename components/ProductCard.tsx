import { Product } from '@/lib/types';
import { useCartContext } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaStar, FaEye, FaHeart } from 'react-icons/fa';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCartContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite Button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <FaHeart className={`${isFavorite ? 'text-red-500' : 'text-gray-400'}`} />
      </button>

      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className={`object-contain p-4 transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Quick View Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity">
              <div className="text-white text-center">
                <FaEye className="text-3xl mx-auto mb-2" />
                <span className="font-semibold">Quick View</span>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="flex justify-between items-start mb-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            {product.category}
          </span>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="font-semibold">{product.rating.rate}</span>
            <span className="text-gray-500 text-sm ml-1">({product.rating.count})</span>
          </div>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Product Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Action Buttons */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.price > 100 && (
              <div className="text-xs text-green-600 font-semibold mt-1">
                Free Shipping
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95"
              aria-label={`Add ${product.title} to cart`}
            >
              <FaShoppingCart className="mr-2" />
              Add
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>SKU: {product.id.toString().padStart(6, '0')}</span>
            <span className="text-green-600 font-semibold">In Stock</span>
          </div>
        </div>
      </div>

      {/* Hover Effects */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-xl pointer-events-none transition-all duration-300" />
    </div>
  );
};

export default ProductCard;