// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import LoginScreen from "./components/LoginScreen";
// import ForgotPasswordScreen from "./components/ForgotPasswordScreen";
// import VerifyEmailScreen from "./components/VerifyEmailScreen";
// import ResetPasswordScreen from "./components/ResetPasswordScreen";
// import SuccessScreen from "./components/SuccesScreen";
// import Dashboard from "./components/Dashboard";
// import UserManagement from "./components/UserManagement";
// import Administrators from "./components/Administrators";
// import ProfileSettings from "./components/ProfileSettings";



// const App = () => {
//   // Simulated authentication (replace with real logic later)
//   const isAuthenticated = true;

//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/login" element={<LoginScreen />} />
//         <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
//         <Route path="/check-email" element={<VerifyEmailScreen />} />
//         <Route path="/reset-password" element={<ResetPasswordScreen />} />
//         <Route path="/success" element={<SuccessScreen />} />

//         {/* Protected Routes */}
//         {isAuthenticated && (
//           <>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/user-management" element={<UserManagement />} />
//             <Route path="/administrators" element={<Administrators />} />
//             <Route path="/profile" element={<ProfileSettings />} />
//           </>
//         )}

//         {/* Catch all - redirect to login */}
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import LoginScreen from './components/LoginScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import VerifyEmailScreen from './components/VerifyEmailScreen';
import ResetPasswordScreen from './components/ResetPasswordScreen';
// import PasswordResetSuccessScreen from './components/PasswordResetSuccessScreen';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import Administrators from './components/Administrators';
import ProfileSettings from './components/ProfileSettings';
import SuccessScreen from './components/SuccesScreen';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Authentication */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/check-email" element={<VerifyEmailScreen />} />
        <Route path="/reset-password" element={<ResetPasswordScreen />} />
        <Route path="/success" element={<SuccessScreen />} />

        {/* Protected Routes - Admin Panel */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/administrators"
          element={
            <ProtectedRoute>
              <Administrators />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />

        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;