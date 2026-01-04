import { FaFacebook, FaTwitter, FaInstagram, FaGithub, FaHeart } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', href: '/products' },
        { label: 'Featured', href: '/' },
        { label: 'New Arrivals', href: '/products?sort=new' },
        { label: 'On Sale', href: '/products?sort=sale' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Shipping Info', href: '/shipping' },
        { label: 'Returns', href: '/returns' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="text-2xl font-bold text-white mb-4 inline-block">
              FakeStore
            </Link>
            <p className="text-gray-400 mb-6">
              Your one-stop shop for amazing products at unbeatable prices. 
              We bring you quality items from around the world.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="text-xl" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest deals and updates.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} FakeStore. All rights reserved.
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <span>Made with</span>
              <FaHeart className="text-red-500 mx-1" />
              <span>using Next.js & FakeStore API</span>
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <img
                src="https://cdn.iconscout.com/icon/free/png-256/free-visa-credit-card-5-203111.png"
                alt="Visa"
                className="h-8 w-auto opacity-70"
              />
              <img
                src="https://cdn.iconscout.com/icon/free/png-256/free-mastercard-5-203112.png"
                alt="Mastercard"
                className="h-8 w-auto opacity-70"
              />
              <img
                src="https://cdn.iconscout.com/icon/free/png-256/free-paypal-5-203113.png"
                alt="PayPal"
                className="h-8 w-auto opacity-70"
              />
              <img
                src="https://cdn.iconscout.com/icon/free/png-256/free-apple-pay-5-203114.png"
                alt="Apple Pay"
                className="h-8 w-auto opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;