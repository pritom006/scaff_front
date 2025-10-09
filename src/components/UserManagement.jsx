import React, { useState } from "react";
import { LayoutDashboard, Users, Shield, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const UserManagement = () => {
  const [users] = useState([
    { id: 1, slNo: "#1233", name: "Kathryn Murp", email: "bockely@att.com", phone: "(201) 555-0124" },
    { id: 2, slNo: "#1234", name: "John Doe", email: "john@example.com", phone: "(202) 555-0125" },
    { id: 3, slNo: "#1235", name: "Jane Smith", email: "jane@example.com", phone: "(203) 555-0126" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = (id) => {
    console.log("Delete user:", id);
  };

  return (
    <div className="flex min-h-screen bg-[#fefff5]">
      {/* Sidebar */}
      <div className="w-64 bg-[#fefff5] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            
            <div>
              <Logo />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition mb-2">
            <LayoutDashboard size={20} />
            <span>DashBoard</span>
          </Link>
          <Link to="/user-management" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-yellow-500 text-black font-semibold transition mb-2">
            <Users size={20} />
            <span>User Management</span>
          </Link>
          <Link to="/administrators" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition">
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

        {/* Table Content */}
        <div className="flex-1 p-8">
          <div className="bg-[#fefff5] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SL no.</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Full Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-600">{user.slNo}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 py-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                &lt; Prev
              </button>
              <button className="px-4 py-2 bg-black text-white rounded">
                {currentPage}
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;