import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { authApi } from "../services/adminApi";

const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic email validation
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // API endpoint: POST /auth/password-reset-request/
      const response = await authApi.passwordResetRequest(email);
      
      if (response.success) {
        setSuccess("OTP sent to your email successfully!");
        // Save email for next step
        localStorage.setItem('resetEmail', email);
        
        // Navigate to verify OTP screen after 1.5 seconds
        setTimeout(() => {
          navigate("/check-email");
        }, 1500);
      } else {
        setError(response.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      
      // Handle different error types
      if (err.response) {
        // Server responded with error
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error;
        
        if (status === 404) {
          setError("Email not found. Please check your email address.");
        } else if (status === 400) {
          setError(message || "Invalid request. Please check your email.");
        } else if (status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(message || "Failed to send OTP. Please try again.");
        }
      } else if (err.request) {
        // Request was made but no response
        setError("Network error. Please check your internet connection.");
      } else {
        // Something else happened
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-[#fefff5] rounded-lg p-8 w-full max-w-md">
        <Logo />
        
        <h1 className="text-2xl font-semibold text-center mb-2">Forget Password?</h1>
        <p className="text-gray-600 text-center mb-8 text-sm">
          Please enter your email to get verification code
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="email@example.com"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Continue"}
            </button>
          </div>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-600 hover:text-black"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
































































