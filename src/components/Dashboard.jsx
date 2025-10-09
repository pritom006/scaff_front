import React from 'react';
import { LayoutDashboard, Users, Shield, UserCheck, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from "./Logo";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#fefff5]">
      {/* Sidebar */}
      <div className="w-64 bg-[#fefff5] border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
              <Logo />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-black text-white font-medium transition mb-2">
            <LayoutDashboard size={20} className="text-yellow-400" />
            <span>DashBoard</span>
          </Link>
          <Link to="/user-management" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition mb-2">
            <Users size={20} />
            <span>User Management</span>
          </Link>
          <Link to="/administrators" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition">
            <Shield size={20} />
            <span>Administrators</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
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
                <Link
                      to="/profile"
                        className="ml-4 text-gray-600 hover:text-black"
                      >
                       Profile Settings
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-8">
          <div className="bg-[#fefff5] rounded-lg p-8">
            {/* Greeting */}
            <div className="mb-8">
              <p className="text-gray-600 mb-2">Hi, Good Morning</p>
              <h1 className="text-3xl font-bold text-gray-800">Moni Roy</h1>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-dotted border-gray-300 mb-8"></div>

            {/* User's Overview */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">User's Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users Card */}
                <div className="bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center justify-center w-14 h-14 bg-red-800 rounded-full mb-4">
                    <Users className="text-white" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-gray-800 mb-2">1320</div>
                  <div className="text-gray-700 font-medium">Total Users</div>
                </div>

                {/* Today's New Users Card */}
                <div className="bg-gradient-to-br from-lime-200 to-lime-300 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center justify-center w-14 h-14 bg-red-800 rounded-full mb-4">
                    <TrendingUp className="text-white" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-gray-800 mb-2">8</div>
                  <div className="text-gray-700 font-medium">Today's New Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;