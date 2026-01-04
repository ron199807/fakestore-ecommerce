import { NextPage } from 'next';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaHistory, 
  FaHeart,
  FaShoppingBag,
  FaSignOutAlt,
  FaCog,
  FaShieldAlt
} from 'react-icons/fa';
import { useEffect } from 'react';

const ProfilePage: NextPage = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = [
    { icon: <FaShoppingBag />, label: 'Orders', value: '12', color: 'bg-blue-500' },
    { icon: <FaHeart />, label: 'Wishlist', value: '8', color: 'bg-red-500' },
    { icon: <FaHistory />, label: 'Pending', value: '2', color: 'bg-yellow-500' },
    { icon: <FaShieldAlt />, label: 'Member Since', value: '2023', color: 'bg-green-500' },
  ];

  const recentOrders = [
    { id: '#ORD-001', date: 'Dec 15, 2023', amount: '$129.99', status: 'Delivered' },
    { id: '#ORD-002', date: 'Dec 10, 2023', amount: '$89.99', status: 'Processing' },
    { id: '#ORD-003', date: 'Dec 5, 2023', amount: '$199.99', status: 'Delivered' },
  ];

  return (
    <>
      <Head>
        <title>FakeStore - My Profile</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
                {user.name.firstname.charAt(0)}{user.name.lastname.charAt(0)}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold">
                  {user.name.firstname} {user.name.lastname}
                </h1>
                <p className="text-blue-100">@{user.username}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-300">⭐</span>
                  <span className="ml-2">Gold Member</span>
                </div>
              </div>
            </div>
            <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center">
              <FaEdit className="mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center">
                  <div className={`inline-flex p-3 rounded-full ${stat.color} text-white mb-4`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                <button className="text-blue-600 hover:text-blue-700 flex items-center">
                  <FaEdit className="mr-2" />
                  Edit
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Full Name</div>
                      <div className="font-semibold">
                        {user.name.firstname} {user.name.lastname}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <FaEnvelope className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email Address</div>
                      <div className="font-semibold">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <FaPhone className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Phone Number</div>
                      <div className="font-semibold">{user.phone}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <FaMapMarkerAlt className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <div className="font-semibold">
                        {user.address.street}, {user.address.city}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <button className="text-blue-600 hover:text-blue-700">View All</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Order ID</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{order.id}</td>
                        <td className="py-3 px-4 text-gray-600">{order.date}</td>
                        <td className="py-3 px-4 font-semibold">{order.amount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'Delivered' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaShoppingBag className="mr-3 text-gray-600" />
                  <span>My Orders</span>
                </button>
                <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaHeart className="mr-3 text-gray-600" />
                  <span>Wishlist</span>
                </button>
                <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaHistory className="mr-3 text-gray-600" />
                  <span>Order History</span>
                </button>
                <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaCog className="mr-3 text-gray-600" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                >
                  <FaSignOutAlt className="mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h3>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-semibold mb-2">Primary Address</div>
                  <div className="text-sm text-gray-600">
                    {user.address.street}<br />
                    {user.address.city}, {user.address.zipcode}<br />
                    {user.address.geolocation.lat}, {user.address.geolocation.long}
                  </div>
                </div>
                <button className="w-full text-center text-blue-600 hover:text-blue-700 font-semibold py-2">
                  + Add New Address
                </button>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Password</span>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold">
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Two-Factor Auth</span>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Email Notifications</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" id="notifications" />
                    <label
                      htmlFor="notifications"
                      className="block w-12 h-6 bg-gray-300 rounded-full cursor-pointer"
                    >
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;