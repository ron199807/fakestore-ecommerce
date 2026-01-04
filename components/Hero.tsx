import { FaArrowRight, FaShieldAlt, FaShippingFast, FaTag } from 'react-icons/fa';
import Link from 'next/link';

const Hero = () => {
  const features = [
    {
      icon: <FaShippingFast className="text-3xl" />,
      title: 'Free Shipping',
      description: 'On orders over $50',
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: 'Secure Payment',
      description: '100% secure transactions',
    },
    {
      icon: <FaTag className="text-3xl" />,
      title: 'Best Price',
      description: 'Price match guarantee',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing Products at <span className="text-yellow-300">Unbeatable Prices</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Shop from thousands of products across electronics, clothing, jewelry, and more. 
              Quality guaranteed with free shipping on orders over $50.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/products"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 flex items-center justify-center"
              >
                Shop Now
                <FaArrowRight className="ml-2" />
              </Link>
              <Link
                href="/products?category=electronics"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-lg text-lg transition-all"
              >
                View Electronics
              </Link>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-transform"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-blue-200">{feature.description}</p>
              </div>
            ))}
            
            {/* Special Offer Card */}
            <div className="col-span-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">50%</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Summer Sale</h3>
              <p className="text-white/90">Limited time offer on selected items</p>
              <Link
                href="/products?sort=sale"
                className="inline-block mt-4 bg-white text-orange-600 hover:bg-gray-100 font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Shop Sale
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">10K+</div>
            <div className="text-blue-200">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">5K+</div>
            <div className="text-blue-200">Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">24/7</div>
            <div className="text-blue-200">Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">100%</div>
            <div className="text-blue-200">Secure</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;