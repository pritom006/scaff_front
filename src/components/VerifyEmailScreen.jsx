import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { authApi } from "../services/adminApi";

const VerifyEmailScreen = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // Get email from localStorage (set in ForgotPasswordScreen)
    const resetEmail = localStorage.getItem('resetEmail');
    if (resetEmail) {
      setEmail(resetEmail);
    } else {
      // If no email found, redirect back to forgot password
      navigate('/forgot-password');
    }
  }, [navigate]);

  // Handle OTP input change
  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setCode(newCode);

    // Focus last filled input or first empty
    const nextIndex = Math.min(pastedData.length, 5);
    document.getElementById(`code-${nextIndex}`)?.focus();
  };

  // Verify OTP
  const handleVerify = async () => {
    const otpCode = code.join("");
    
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // API endpoint: POST /auth/password-reset-verify-otp/
      const response = await authApi.passwordResetVerifyOTP(email, otpCode);
      
      if (response.success) {
        setSuccess("OTP verified successfully!");
        // Save OTP for password reset step
        localStorage.setItem('verifiedOTP', otpCode);
        
        // Navigate to reset password screen
        setTimeout(() => {
          navigate("/reset-password");
        }, 1000);
      } else {
        setError(response.message || "Invalid OTP. Please try again.");
        // Clear code on error
        setCode(["", "", "", "", "", ""]);
        document.getElementById('code-0')?.focus();
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      
      // Handle different error types
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error;
        
        if (status === 400) {
          setError(message || "Invalid OTP. Please check and try again.");
        } else if (status === 404) {
          setError("OTP expired. Please request a new one.");
        } else if (status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(message || "Invalid OTP. Please try again.");
        }
      } else if (err.request) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("An error occurred. Please try again.");
      }
      
      // Clear code on error
      setCode(["", "", "", "", "", ""]);
      document.getElementById('code-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setResending(true);
    setError("");
    setSuccess("");

    try {
      // API endpoint: POST /auth/password-reset-request/
      const response = await authApi.passwordResetRequest(email);
      
      if (response.success) {
        setSuccess("OTP resent successfully! Check your email.");
        setCode(["", "", "", "", "", ""]);
        document.getElementById('code-0')?.focus();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.message || "Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      
      if (err.response) {
        const message = err.response.data?.message || err.response.data?.error;
        setError(message || "Failed to resend OTP. Please try again.");
      } else if (err.request) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-[#fefff5] rounded-lg shadow-lg p-8 w-full max-w-md">
        <Logo />
        
        <h1 className="text-2xl font-semibold text-center mb-2">Check your email</h1>
        <p className="text-gray-600 text-center mb-8 text-sm">
          We sent a 6-digit code to<br />
          <span className="font-semibold text-gray-800">{email}</span> 📧
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                disabled={loading || resending}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || resending || code.join("").length !== 6}
            className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          {/* Resend OTP */}
          <div className="text-center text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button 
              onClick={handleResend}
              disabled={resending || loading}
              className="text-black font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? "Sending..." : "Resend"}
            </button>
          </div>

          {/* Back to Email */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('resetEmail');
                navigate("/forgot-password");
              }}
              className="text-sm text-gray-600 hover:text-black"
            >
              ← Change email address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailScreen;
