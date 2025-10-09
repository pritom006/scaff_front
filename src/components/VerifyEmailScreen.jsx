import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

const VerifyEmailScreen = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(["2", "8", "4", "", ""]);

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 4) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleVerify = () => {
    // Add any verification logic if needed
    navigate("/reset-password"); // Navigate to reset password screen
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-[#fefff5] rounded-lg shadow-lg p-8 w-full max-w-md">
        <Logo />
        
        <h1 className="text-2xl font-semibold text-center mb-2">Check your email</h1>
        <p className="text-gray-600 text-center mb-8 text-sm">
          We sent a code to your email address 📧. Please check<br />
          your email for the 5 digit code.
        </p>

        <div className="space-y-6">
          <div className="flex justify-center gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            Verify
          </button>

          <div className="text-center text-sm text-gray-600">
            You have not received the email?{" "}
            <button className="text-black font-medium hover:underline">
              Resend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailScreen;
