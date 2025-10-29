// UserManagement.jsx - COMPLETE WITH API INTEGRATION
import React, { useState, useEffect } from "react";
import { LayoutDashboard, Users, Shield, Trash2, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { userApi } from "../services/adminApi";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchUsers();
  }, [currentPage, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await userApi.getUsers(currentPage, pageSize, searchTerm);
      
      if (response.success) {
        setUsers(response.data.users);
        setTotal(response.data.pagination.total);
        setTotalPages(response.data.pagination.total_pages);
      } else {
        setError("Failed to load users");
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError("Failed to load users");
      
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    setDeleting(true);
    
    try {
      const response = await userApi.deleteUser(selectedUser.id);
      
      if (response.success) {
        alert("User deleted successfully!");
        setShowDeleteModal(false);
        setSelectedUser(null);
        
        // Refresh the list
        fetchUsers();
      } else {
        alert(response.message || "Failed to delete user");
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(
        err.response?.data?.message || 
        "Failed to delete user. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition mb-2"
          >
            <LayoutDashboard size={20} />
            <span>DashBoard</span>
          </Link>
          <Link 
            to="/user-management" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-black text-white font-semibold transition mb-2"
          >
            <Users size={20} className="text-yellow-400" />
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
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, or phone..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Search
                </button>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                      fetchUsers();
                    }}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Clear
                  </button>
                )}
              </form>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
                <button 
                  onClick={fetchUsers}
                  className="ml-4 underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No users found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SL no.</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Full Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone Number</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr 
                          key={user.id} 
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 text-sm text-gray-600">
                            #{((currentPage - 1) * pageSize) + index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800">
                            {user.full_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.phone || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDelete(user)}
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
                <div className="flex items-center justify-between px-6 py-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} users
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      &lt; Prev
                    </button>
                    <span className="px-4 py-2 bg-gray-100 rounded font-medium">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Next &gt;
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#fefff5] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-center mb-4">Confirm Deletion</h2>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete user <br />
              <strong>{selectedUser?.full_name || selectedUser?.email}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;