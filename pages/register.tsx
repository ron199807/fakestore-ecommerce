import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const RegisterPage: NextPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    phone: '',
    city: '',
    street: '',
    zipcode: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }
    
    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const userData = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        name: {
          firstname: formData.firstname,
          lastname: formData.lastname,
        },
        address: {
          city: formData.city || 'New York',
          street: formData.street || '123 Main St',
          number: 1,
          zipcode: formData.zipcode || '10001',
          geolocation: {
            lat: '0',
            long: '0',
          },
        },
        phone: formData.phone || '1-234-567-8900',
      };
      
      await register(userData);
    } catch (error) {
      setErrors({
        submit: 'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>FakeStore - Register</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-bold text-blue-600 mb-2">FakeStore</h1>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-2 text-gray-600">
              Join thousands of happy customers shopping with us
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              {/* Left Side - Benefits */}
              <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8">
                <h3 className="text-2xl font-bold mb-6">Why Join Us?</h3>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <div className="bg-white/20 rounded-full p-2 mr-4">
                      <span className="text-xl">🚚</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Free Shipping</h4>
                      <p className="text-blue-100 text-sm">On orders over $50</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white/20 rounded-full p-2 mr-4">
                      <span className="text-xl">🎁</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Exclusive Deals</h4>
                      <p className="text-blue-100 text-sm">Members-only discounts</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white/20 rounded-full p-2 mr-4">
                      <span className="text-xl">⭐</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Reward Points</h4>
                      <p className="text-blue-100 text-sm">Earn points on every purchase</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white/20 rounded-full p-2 mr-4">
                      <span className="text-xl">🔒</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Secure Checkout</h4>
                      <p className="text-blue-100 text-sm">100% protected transactions</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Right Side - Registration Form */}
              <div className="md:w-2/3 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.submit && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <p className="text-sm text-red-700">{errors.submit}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username */}
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                        Username *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="username"
                          name="username"
                          type="text"
                          value={formData.username}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border ${
                            errors.username ? 'border-red-500' : 'border-gray-300'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Choose a username"
                        />
                      </div>
                      {errors.username && (
                        <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="your@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* First Name */}
                    <div>
                      <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        id="firstname"
                        name="firstname"
                        type="text"
                        value={formData.firstname}
                        onChange={handleChange}
                        className={`block w-full px-3 py-3 border ${
                          errors.firstname ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="John"
                      />
                      {errors.firstname && (
                        <p className="mt-2 text-sm text-red-600">{errors.firstname}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        id="lastname"
                        name="lastname"
                        type="text"
                        value={formData.lastname}
                        onChange={handleChange}
                        className={`block w-full px-3 py-3 border ${
                          errors.lastname ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Doe"
                      />
                      {errors.lastname && (
                        <p className="mt-2 text-sm text-red-600">{errors.lastname}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="At least 6 characters"
                        />
                      </div>
                      {errors.password && (
                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Confirm your password"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your city"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Creating account...
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;