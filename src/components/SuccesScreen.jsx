import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const SuccessScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-[#fefff5] rounded-lg shadow-lg p-8 w-full max-w-md">
        <Logo />
        
        <h1 className="text-2xl font-semibold text-center mb-2">Password Updated</h1>
        <h2 className="text-2xl font-semibold text-center mb-4">Successfully!</h2>
        <p className="text-gray-600 text-center mb-8 text-sm">
          Your new password has been saved. You can now<br />
          continue securely.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors mt-6"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
