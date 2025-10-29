import React, { useState, useEffect } from "react";
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
import { adminApi } from "../services/adminApi"; // Import the API service

const Administrators = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 1,
  });

  // Form state for creating new admin
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
    role: "admin",
    password: "",
  });

  // Form state for editing admin
  const [editFormData, setEditFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
    role: "admin",
  });

  // Fetch administrators list
  const fetchAdministrators = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminApi.getAdmins(page, pagination.page_size);
      
      if (result.success) {
        setAdminData(result.data.administrators || []);
        setPagination(result.data.pagination || {
          page: 1,
          page_size: 10,
          total: 0,
          total_pages: 1,
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch administrators";
      setError(errorMsg);
      console.error("Error fetching administrators:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new administrator
  const createAdministrator = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await adminApi.createAdmin(formData);
      
      if (result.success) {
        // Reset form
        setFormData({
          email: "",
          full_name: "",
          phone: "",
          role: "admin",
          password: "",
        });
        setShowCreateModal(false);
        setSuccessMessage(result.message || "Administrator created successfully!");
        
        // Refresh the list
        await fetchAdministrators(pagination.page);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to create administrator";
      setError(errorMsg);
      console.error("Error creating administrator:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update administrator
  const updateAdministrator = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await adminApi.updateAdmin(selectedAdmin.id, editFormData);
      
      if (result.success) {
        setShowEditModal(false);
        setSuccessMessage(result.message || "Administrator updated successfully!");
        
        // Refresh the list
        await fetchAdministrators(pagination.page);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to update administrator";
      setError(errorMsg);
      console.error("Error updating administrator:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete administrator
  const deleteAdministrator = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await adminApi.deleteAdmin(selectedAdmin.id);
      
      if (result.success) {
        setShowDeleteModal(false);
        setSuccessMessage(result.message || "Administrator deleted successfully!");
        
        // Refresh the list
        await fetchAdministrators(pagination.page);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to delete administrator";
      setError(errorMsg);
      console.error("Error deleting administrator:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load administrators on component mount
  useEffect(() => {
    fetchAdministrators(1);
  }, []);

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setEditFormData({
      email: admin.email,
      full_name: admin.full_name,
      phone: admin.phone,
      role: admin.role,
    });
    setShowEditModal(true);
  };

  const handleDelete = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      fetchAdministrators(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.total_pages) {
      fetchAdministrators(pagination.page + 1);
    }
  };

  // Auto-dismiss error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
                <span>{successMessage}</span>
                <button onClick={() => setSuccessMessage(null)} className="text-green-700 hover:text-green-900">
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}

            {/* Table */}
            {!loading && (
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
                    {adminData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-gray-500">
                          No administrators found
                        </td>
                      </tr>
                    ) : (
                      adminData.map((admin, index) => (
                        <tr
                          key={admin.id}
                          className="border-t border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            #{(pagination.page - 1) * pagination.page_size + index + 1}
                          </td>
                          <td className="py-3 px-4">{admin.full_name}</td>
                          <td className="py-3 px-4">{admin.email}</td>
                          <td className="py-3 px-4">{admin.phone}</td>
                          <td className="py-3 px-4 capitalize">{admin.role}</td>
                          <td className="py-3 px-4 flex gap-2 justify-center">
                            <button
                              onClick={() => handleEdit(admin)}
                              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                              disabled={loading}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(admin)}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                              disabled={loading}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={handlePrevPage}
                disabled={pagination.page === 1 || loading}
                className="bg-black text-white px-4 py-1 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                &lt; Prev
              </button>
              <span className="font-semibold">
                {pagination.page} / {pagination.total_pages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={pagination.page === pagination.total_pages || loading}
                className="bg-black text-white px-4 py-1 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --------------- CREATE MODAL --------------- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#fefff5] rounded-lg p-6 w-[450px] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowCreateModal(false);
                setError(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              disabled={loading}
            >
              <X />
            </button>
            <h2 className="text-center text-lg font-semibold text-purple-900 mb-4 border-b border-dotted pb-2">
              New Administrator Profile Create
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  placeholder="Enter full name"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  placeholder="Enter email"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Phone *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  placeholder="+8801234567890"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  placeholder="Enter password"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                  disabled={loading}
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError(null);
                  }}
                  className="border border-gray-400 rounded px-4 py-2 hover:bg-gray-100"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={createAdministrator}
                  className="bg-black text-yellow-400 px-6 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------- EDIT MODAL --------------- */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#fefff5] rounded-lg p-6 w-[450px] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowEditModal(false);
                setError(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              disabled={loading}
            >
              <X />
            </button>
            <h2 className="text-center text-lg font-semibold text-purple-900 mb-4">
              Edit Administrator
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={editFormData.full_name}
                  onChange={handleEditInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Role</label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  disabled={loading}
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setError(null);
                  }}
                  className="border border-gray-400 rounded px-4 py-2 hover:bg-gray-100"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={updateAdministrator}
                  className="bg-black text-yellow-400 px-6 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------- DELETE CONFIRMATION MODAL --------------- */}
      {showDeleteModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#fefff5] rounded-lg p-6 w-[400px] relative">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setError(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              disabled={loading}
            >
              <X />
            </button>
            <h2 className="text-center text-lg font-semibold text-purple-900 mb-4">
              Confirm Deletion
            </h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                {error}
              </div>
            )}
            
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedAdmin.full_name}</strong>?
            </p>
            
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setError(null);
                }}
                className="border border-gray-400 rounded px-4 py-2 hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={deleteAdministrator}
                className="bg-yellow-400 text-black font-medium px-6 py-2 rounded hover:bg-yellow-500 flex items-center gap-2 disabled:bg-gray-400"
                disabled={loading}
              >
                <Trash2 size={16} />
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administrators;