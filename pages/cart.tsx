import { NextPage } from 'next';
import Head from 'next/head';
import { useCartContext } from '@/contexts/CartContext';
import Image from 'next/image';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';

const CartPage: NextPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, total } = useCartContext();

  if (cartItems.length === 0) {
    return (
      <>
        <Head>
          <title>FakeStore - Cart</title>
        </Head>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl text-gray-300 mb-6">
              <FaShoppingBag />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>FakeStore - Cart ({cartItems.length} items)</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cartItems.map((item) => (
                <div key={item.id} className="p-6 border-b last:border-b-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-48 w-48 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    
                    <div className="sm:ml-6 mt-4 sm:mt-0 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">{item.category}</p>
                          <p className="text-gray-800 font-bold mt-2">${item.price.toFixed(2)}</p>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTrash className="text-xl" />
                        </button>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 rounded-l-md border border-gray-300 disabled:opacity-50"
                          >
                            <FaMinus />
                          </button>
                          <span className="px-4 py-2 border-t border-b border-gray-300 min-w-[60px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 rounded-r-md border border-gray-300"
                          >
                            <FaPlus />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-semibold flex items-center"
              >
                <FaTrash className="mr-2" />
                Clear Entire Cart
              </button>
              
              <Link
                href="/products"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">$5.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(total + 5.99 + (total * 0.08)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold mb-4">
                Proceed to Checkout
              </button>
              
              <div className="text-center text-sm text-gray-500">
                <p>Free returns • Secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;