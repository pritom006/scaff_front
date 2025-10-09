import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Shield,
  Edit,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Administrators = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const adminData = [
    {
      id: "#1233",
      name: "Devon Lane",
      email: "bockely@att.com",
      phone: "(201) 555-0124",
      access: "Admin",
    },
    {
      id: "#1234",
      name: "Foysal Rahman",
      email: "csilvers@rizon.com",
      phone: "(219) 555-0114",
      access: "Admin",
    },
    {
      id: "#1235",
      name: "Eleanor Pena",
      email: "xterris@gmail.com",
      phone: "(505) 555-0125",
      access: "Admin",
    },
  ];

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setShowEditModal(true);
  };

  const handleDelete = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  return (
    <div className="flex min-h-screen bg-[#fefff5]">
      {/* Sidebar */}
      <div className="w-64 bg-[#fefff5] border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">     
            <div>
              <Logo />
            </div>
          </div>
        </div>

        {/* Navigation */}
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-black text-white font-medium transition"
          >
            <Shield size={20} className="text-yellow-400" />
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

        {/* Content */}
        <div className="flex-1 p-8 bg-[#fefff5]">
          <div className="bg-[#fefff5] rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Administrators List
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                <Plus size={18} />
                New Administrator Profile Create
              </button>
            </div>

            {/* Table */}
            <div className="border-2 border-dotted border-gray-300 rounded-md overflow-x-auto">
              <table className="min-w-full text-left text-gray-700">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="py-3 px-4">SL. no.</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Contact Number</th>
                    <th className="py-3 px-4">Has Access To</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.map((admin, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{admin.id}</td>
                      <td className="py-3 px-4">{admin.name}</td>
                      <td className="py-3 px-4">{admin.email}</td>
                      <td className="py-3 px-4">{admin.phone}</td>
                      <td className="py-3 px-4">{admin.access}</td>
                      <td className="py-3 px-4 flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(admin)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button className="bg-black text-white px-4 py-1 rounded">
                &lt; Prev
              </button>
              <span className="font-semibold">1</span>
              <button className="bg-black text-white px-4 py-1 rounded">
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --------------- CREATE MODAL --------------- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#fefff5] rounded-lg p-6 w-[450px] relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X />
            </button>
            <h2 className="text-center text-lg font-semibold text-purple-900 mb-4 border-b border-dotted pb-2">
              New Administrator Profile Create
            </h2>

            <form className="space-y-3">
              <div>
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 mt-1"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2 mt-1"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Phone</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 mt-1"
                  placeholder="Enter phone"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Role</label>
                <select className="w-full border rounded px-3 py-2 mt-1">
                  <option>Admin</option>
                  <option>Super Admin</option>
                </select>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="border border-gray-400 rounded px-4 py-2 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button className="bg-black text-yellow-400 px-6 py-2 rounded hover:bg-gray-800">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------- EDIT MODAL --------------- */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#fefff5] rounded-lg p-6 w-[450px] relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X />
            </button>
            <h2 className="text-center text-lg font-semibold text-purple-900 mb-4">
              Edit Administrator
            </h2>

            <form className="space-y-3">
              <div>
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  defaultValue={selectedAdmin.name}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  defaultValue={selectedAdmin.email}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Phone</label>
                <input
                  type="text"
                  defaultValue={selectedAdmin.phone}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Role</label>
                <select
                  defaultValue={selectedAdmin.access}
                  className="w-full border rounded px-3 py-2 mt-1"
                >
                  <option>Admin</option>
                  <option>Super Admin</option>
                </select>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="border border-gray-400 rounded px-4 py-2 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button className="bg-black text-yellow-400 px-6 py-2 rounded hover:bg-gray-800">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------- DELETE CONFIRMATION MODAL --------------- */}
      {showDeleteModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#fefff5] rounded-lg p-6 w-[400px] relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X />
            </button>
            <h2 className="text-center text-lg font-semibold text-purple-900 mb-6">
              Confirm Deletion
            </h2>
            <div className="flex justify-between">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="border border-gray-400 rounded px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button className="bg-yellow-400 text-black font-medium px-6 py-2 rounded hover:bg-yellow-500 flex items-center gap-2">
                <Trash2 size={16} /> Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administrators;