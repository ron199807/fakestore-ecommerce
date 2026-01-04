import { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image';
import { productApi } from '@/lib/api';
import { Product } from '@/lib/types';
import { useCartContext } from '@/contexts/CartContext';
import { FaStar, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

interface ProductDetailPageProps {
  product: Product;
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);

  if (router.isFallback) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <Link href="/products" className="text-blue-600 hover:text-blue-700">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  return (
    <>
      <Head>
        <title>FakeStore - {product.title}</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/products"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative h-96 lg:h-full">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating.rate)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-700">
                    {product.rating.rate} ({product.rating.count} reviews)
                  </span>
                </div>
              </div>

              <p className="text-3xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</p>

              <p className="text-gray-700 mb-8">{product.description}</p>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-l-md border border-gray-300"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-t border-b border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-r-md border border-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center mb-4"
              >
                <FaShoppingCart className="mr-3" />
                Add to Cart ({quantity})
              </button>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Product Information</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Free shipping on orders over $50</li>
                  <li>• 30-day return policy</li>
                  <li>• Secure payment processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { id } = context.params!;
    const response = await productApi.getById(Number(id));

    return {
      props: {
        product: response.data,
      },
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      notFound: true,
    };
  }
};

export default ProductDetailPage;