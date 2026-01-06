import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { FaLock, FaUser, FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage: NextPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
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
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    setErrors({});
    
    try {
      await login(formData);
    } catch (error) {
      setErrors({
        submit: 'Invalid username or password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoUser: { username: string; password: string }) => {
    setFormData(demoUser);
    
    try {
      await login(demoUser);
    } catch (error) {
      setErrors({
        submit: 'Demo login failed. Please try again.',
      });
    }
  };

  const demoUsers = [
    { username: 'johnd', password: 'm38rmF$', name: 'John Doe' },
    { username: 'mor_2314', password: '83r5^_', name: 'David Morrison' },
    { username: 'kevinryan', password: 'kev02937@', name: 'Kevin Ryan' },
  ];

  return (
    <>
      <Head>
        <title>FakeStore - Login</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-bold text-blue-600 mb-2">FakeStore</h1>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">
              Sign in to your account to continue shopping
            </p>
          </div>

          {/* Demo Users Quick Login */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Quick Login (Demo Users)</h3>
            <div className="space-y-2">
              {demoUsers.map((demoUser) => (
                <button
                  key={demoUser.username}
                  onClick={() => handleDemoLogin(demoUser)}
                  className="w-full flex justify-between items-center bg-white border border-blue-200 rounded-lg p-3 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-left">
                    <div className="font-medium text-blue-700">{demoUser.name}</div>
                    <div className="text-sm text-blue-600">@{demoUser.username}</div>
                  </div>
                  <div className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded">
                    Click to login
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-500">Or sign in manually</span>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {errors.submit && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FaLock className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.username ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter your username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to FakeStore?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/register"
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;