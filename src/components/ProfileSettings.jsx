// ProfileSettings.jsx - Main Profile Page
import React, { useState } from "react";
import { LayoutDashboard, Users, Shield, X } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const ProfileSettings = () => {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#fefff5] border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div>
              <Logo />
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition mb-2"
          >
            <LayoutDashboard size={20} />
            <span>DashBoard</span>
          </Link>
          <Link
            to="/user-management"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition mb-2"
          >
            <Users size={20} />
            <span>User Management</span>
          </Link>
          <Link
            to="/administrators"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <Shield size={20} />
            <span>Administrators</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#fefff5]">
        {/* Header */}
        <header className="bg-[#fefff5] border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Moni"
                  alt="Avatar"
                  className="w-full h-full"
                />
              </div>
              <div>
                <div className="font-semibold text-gray-800">Moni Roy</div>
                <div className="text-sm text-gray-500">Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <div className="flex-1 p-8">
          <div className="max-w-sm mx-auto">
            <div className="bg-[#fefff5] rounded-lg shadow-lg p-6">
              {/* User Info */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center overflow-hidden mb-3">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ovie"
                    alt="Profile"
                    className="w-full h-full"
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Ovie Rahaman</h2>
                <span className="bg-black text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                  Super Admin
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4"></div>

              {/* Menu Options */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowAccountModal(true)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition text-left"
                >
                  <span className="font-medium text-gray-700">Profile</span>
                  <span className="text-gray-400">&gt;</span>
                </button>

                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition text-left"
                >
                  <span className="font-medium text-gray-700">Change Password</span>
                  <span className="text-gray-400">&gt;</span>
                </button>
              </div>

              {/* Logout Button */}
              <button className="w-full mt-6 bg-black text-yellow-400 font-semibold py-3 rounded-lg hover:bg-gray-800 transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Setting Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#fefff5] rounded-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowAccountModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold text-center mb-6">Account Setting</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue="Ovie Rahaman Sheikh"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="ovierahaman1@gmail.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  defaultValue="+8808445566444"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Category Management</option>
                  <option>Super Admin</option>
                  <option>Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#fefff5] rounded-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold text-center mb-6">Password Change</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Old Password
                </label>
                <input
                  type="password"
                  placeholder="123ADMIN@#@"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Re Type New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;