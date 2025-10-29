// ProfileSettings.jsx - Complete with API Integration

import React, { useState, useEffect } from "react";
import { LayoutDashboard, Users, Shield, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { profileApi, authApi } from "../services/adminApi";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile state
  const [profileData, setProfileData] = useState({
    email: "",
    full_name: "",
    phone: "",
    role: "",
    username: ""
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: ""
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await profileApi.getProfile();

      if (response.success) {
        setProfileData({
          email: response.data.email || "",
          full_name: response.data.full_name || "",
          phone: response.data.phone || "",
          role: response.data.role || "",
          username: response.data.username || ""
        });
      } else {
        setError("Failed to load profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");

      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await profileApi.updateProfile({
        email: profileData.email,
        full_name: profileData.full_name,
        phone: profileData.phone
      });

      if (response.success) {
        setSuccess("Profile updated successfully!");

        // Update localStorage
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        userData.email = profileData.email;
        userData.full_name = profileData.full_name;
        localStorage.setItem("userData", JSON.stringify(userData));

        setTimeout(() => {
          setSuccess("");
          setShowAccountModal(false);
        }, 2000);
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (passwordData.new_password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setSaving(true);

    try {
      // Backend only needs old_password and new_password
      const response = await authApi.changePassword(
        passwordData.old_password,
        passwordData.new_password
      );

      if (response.success) {
        setSuccess("Password changed successfully!");
        setPasswordData({
          old_password: "",
          new_password: ""
        });

        setTimeout(() => {
          setSuccess("");
          setShowPasswordModal(false);
        }, 2000);
      } else {
        setError(response.message || "Failed to change password");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        "Failed to change password. Please check your old password."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  const getRoleName = (role) => {
    const roleMap = {
      admin: "Super Admin",
      staffadmin: "Staff Admin",
      user: "User"
    };
    return roleMap[role] || role;
  };

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

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#fefff5]">
        {/* Header */}
        <header className="bg-[#fefff5] border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.email || "User"}`}
                  alt="Avatar"
                  className="w-full h-full"
                />
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  {loading ? "Loading..." : profileData.full_name || profileData.username || profileData.email}
                </div>
                <div className="text-sm text-gray-500">{getRoleName(profileData.role)}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <div className="flex-1 p-8">
          <div className="max-w-sm mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Loading profile...</p>
              </div>
            ) : (
              <div className="bg-[#fefff5] rounded-lg shadow-lg p-6">
                {/* User Info */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center overflow-hidden mb-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.email}`}
                      alt="Profile"
                      className="w-full h-full"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {profileData.full_name || profileData.username || "User"}
                  </h2>
                  <span className="bg-black text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                    {getRoleName(profileData.role)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4"></div>

                {/* Menu Options */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowAccountModal(true);
                      setError("");
                      setSuccess("");
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition text-left"
                  >
                    <span className="font-medium text-gray-700">Profile</span>
                    <span className="text-gray-400">&gt;</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowPasswordModal(true);
                      setError("");
                      setSuccess("");
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition text-left"
                  >
                    <span className="font-medium text-gray-700">Change Password</span>
                    <span className="text-gray-400">&gt;</span>
                  </button>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="w-full mt-6 bg-black text-yellow-400 font-semibold py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Setting Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#fefff5] rounded-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => {
                setShowAccountModal(false);
                setError("");
                setSuccess("");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold text-center mb-6">Account Setting</h2>

            {/* Success Message */}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, full_name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+8801234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={getRoleName(profileData.role)}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAccountModal(false);
                    setError("");
                    setSuccess("");
                  }}
                  disabled={saving}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save"}
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
              onClick={() => {
                setShowPasswordModal(false);
                setError("");
                setSuccess("");
                setPasswordData({
                  old_password: "",
                  new_password: ""
                });
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold text-center mb-6">Password Change</h2>

            {/* Success Message */}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Old Password
                </label>
                <input
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, old_password: e.target.value })
                  }
                  placeholder="Enter old password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, new_password: e.target.value })
                  }
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setError("");
                    setSuccess("");
                    setPasswordData({
                      old_password: "",
                      new_password: ""
                    });
                  }}
                  disabled={saving}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Updating..." : "Update"}
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
