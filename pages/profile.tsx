import { NextPage } from "next";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/ProtectedRoute";
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
  FaShieldAlt,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const ProfilePage: NextPage = () => {
  const { user, logout, updateProfile, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    street: "",
    city: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setEditForm({
        firstname: user.name.firstname || "",
        lastname: user.name.lastname || "",
        email: user.email || "",
        phone: user.phone || "",
        street: user.address.street || "",
        city: user.address.city || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateProfile({
        name: {
          firstname: editForm.firstname,
          lastname: editForm.lastname,
        },
        email: editForm.email,
        phone: editForm.phone,
        address: {
          ...user.address,
          street: editForm.street,
          city: editForm.city,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original values
      if (user) {
        setEditForm({
          firstname: user.name.firstname,
          lastname: user.name.lastname,
          email: user.email,
          phone: user.phone,
          street: user.address.street,
          city: user.address.city,
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      icon: <FaShoppingBag />,
      label: "Orders",
      value: "12",
      color: "bg-blue-500",
    },
    { 
      icon: <FaHeart />, 
      label: "Wishlist", 
      value: "8", 
      color: "bg-red-500" 
    },
    {
      icon: <FaHistory />,
      label: "Pending",
      value: "2",
      color: "bg-yellow-500",
    },
    {
      icon: <FaShieldAlt />,
      label: "Member Since",
      value: "2023",
      color: "bg-green-500",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      date: "Dec 15, 2023",
      amount: "$129.99",
      status: "Delivered",
    },
    {
      id: "#ORD-002",
      date: "Dec 10, 2023",
      amount: "$89.99",
      status: "Processing",
    },
    {
      id: "#ORD-003",
      date: "Dec 5, 2023",
      amount: "$199.99",
      status: "Delivered",
    },
  ];

  return (
    <ProtectedRoute>
      <Head>
        <title>FakeStore - My Profile</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
                {user?.name.firstname?.charAt(0) || "U"}
                {user?.name.lastname?.charAt(0) || "S"}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold">
                  {user?.name.firstname} {user?.name.lastname}
                </h1>
                <p className="text-blue-100">@{user?.username}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-300">⭐</span>
                  <span className="ml-2">Gold Member</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleEditToggle}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center"
            >
              {isEditing ? <FaTimes className="mr-2" /> : <FaEdit className="mr-2" />}
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 text-center"
                >
                  <div
                    className={`inline-flex p-3 rounded-full ${stat.color} text-white mb-4`}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Personal Information
                </h2>
                {isEditing && (
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaSave className="mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">First Name</div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstname"
                          value={editForm.firstname}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="font-semibold">
                          {user?.name.firstname}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Last Name</div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastname"
                          value={editForm.lastname}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="font-semibold">
                          {user?.name.lastname}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <FaEnvelope className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Email Address</div>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="font-semibold">{user?.email}</div>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <FaPhone className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Phone Number</div>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="font-semibold">{user?.phone}</div>
                      )}
                    </div>
                  </div>

                  {/* Street */}
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <FaMapMarkerAlt className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Street Address</div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="street"
                          value={editForm.street}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="font-semibold">{user?.address.street}</div>
                      )}
                    </div>
                  </div>

                  {/* City */}
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <FaMapMarkerAlt className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">City</div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="city"
                          value={editForm.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="font-semibold">{user?.address.city}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Orders
                </h2>
                <button className="text-blue-600 hover:text-blue-700 font-semibold">
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{order.id}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {order.date}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {order.amount}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/orders')}
                  className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaShoppingBag className="mr-3 text-gray-600" />
                  <span>My Orders</span>
                </button>
                <button 
                  onClick={() => router.push('/wishlist')}
                  className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaHeart className="mr-3 text-gray-600" />
                  <span>Wishlist</span>
                </button>
                <button 
                  onClick={() => router.push('/history')}
                  className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaHistory className="mr-3 text-gray-600" />
                  <span>Order History</span>
                </button>
                <button 
                  onClick={() => router.push('/settings')}
                  className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Shipping Address
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-semibold mb-2">Primary Address</div>
                  <div className="text-sm text-gray-600">
                    {user?.address.street}
                    <br />
                    {user?.address.city}, {user?.address.zipcode}
                    <br />
                    {user?.address.geolocation.lat},{" "}
                    {user?.address.geolocation.long}
                  </div>
                </div>
                <button className="w-full text-center text-blue-600 hover:text-blue-700 font-semibold py-2">
                  + Add New Address
                </button>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Account Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Password</span>
                  <button 
                    onClick={() => router.push('/change-password')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
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
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;