import axios from 'axios';

// ============================================
// CONFIGURATION
// ============================================
const API_BASE_URL = 'http://103.186.20.253:8001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// ============================================
// REQUEST INTERCEPTOR - Add Auth Token
// ============================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR - Handle Token Refresh
// ============================================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        
        // Save new access token
        localStorage.setItem('accessToken', access);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear storage and redirect to login
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION API
// ============================================
export const authApi = {
  /**
   * Login admin user
   * Endpoint: POST /auth/login/
   * Backend returns: { message, access_token: {access: "..."}, refresh, user_id, email, username, full_name, role, is_verified }
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login/', {
        email,
        password,
      });
      
      const backendData = response.data;
      console.log('Backend login response:', backendData); // Debug
      
      // Transform backend response to match frontend expectations
      return {
        success: true,
        message: backendData.message || 'Login successful',
        data: {
          // Extract access token from nested object
          access: backendData.access_token?.access || backendData.access_token,
          refresh: backendData.refresh,
          user: {
            id: backendData.user_id,
            email: backendData.email,
            username: backendData.username,
            full_name: backendData.full_name || '',
            role: backendData.role,
            is_verified: backendData.is_verified
          }
        }
      };
      
    } catch (error) {
      console.error('Login error:', error.response?.data);
      
      // Transform error response
      if (error.response?.data) {
        throw {
          response: {
            data: {
              success: false,
              message: error.response.data.message || error.response.data.error || 'Login failed'
            }
          }
        };
      }
      throw error;
    }
  },

  /**
   * Request password reset - sends OTP to email
   * Endpoint: POST /auth/password-reset-request/
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/password-reset-request/', {
        email,
      });
      return {
        success: true,
        message: response.data.message || 'OTP sent successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Forgot password error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Request password reset (alias for forgotPassword)
   * Endpoint: POST /auth/password-reset-request/
   */
  passwordResetRequest: async (email) => {
    try {
      const response = await api.post('/auth/password-reset-request/', {
        email,
      });
      return {
        success: true,
        message: response.data.message || 'OTP sent successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Password reset request error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Verify OTP for password reset
   * Endpoint: POST /auth/password-reset-verify-otp/
   */
  verifyPasswordResetOTP: async (email, otp_code) => {
    try {
      const response = await api.post('/auth/password-reset-verify-otp/', {
        email,
        otp_code,
      });
      return {
        success: true,
        message: response.data.message || 'OTP verified successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Verify OTP error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Verify OTP for password reset (alias - accepts otpCode parameter)
   * Endpoint: POST /auth/password-reset-verify-otp/
   */
  passwordResetVerifyOTP: async (email, otpCode) => {
    try {
      const response = await api.post('/auth/password-reset-verify-otp/', {
        email,
        otp_code: otpCode,
      });
      return {
        success: true,
        message: response.data.message || 'OTP verified successfully',
        data: response.data
      };
    } catch (error) {
      console.error('OTP verification error:', error.response?.data);
      throw error;
    }
  },

  resetPassword: async (email, otp_code, new_password) => {
  try {
    const response = await api.post('/auth/password-reset-confirm/', {
      email,
      otp_code,
      new_password,  // ✅ Keep as new_password
    });
    return {
      success: true,
      message: response.data.message || 'Password reset successfully',
      data: response.data
    };
  } catch (error) {
    console.error('Reset password error:', error.response?.data);
    throw error;
   }
 },



  passwordResetConfirm: async (email, otpCode, password) => {
  try {
    const response = await api.post('/auth/password-reset-confirm/', {
      email: email,
      otp_code: otpCode,
      new_password: password  // ✅ Backend expects 'new_password', not 'password'
    });
    return {
      success: true,
      message: response.data.message || 'Password reset successfully',
      data: response.data
    };
  } catch (error) {
    console.error('Password reset confirm error:', error.response?.data);
    throw error;
   }
 },

  /**
   * Change password (logged in user)
   * Endpoint: POST /auth/change-password/
   */
  changePassword: async (old_password, new_password) => {
    try {
      const response = await api.post('/auth/change-password/', {
        old_password,
        new_password,
      });
      return {
        success: true,
        message: response.data.message || 'Password changed successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Change password error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Logout user
   * Endpoint: POST /auth/logout/
   */
  logout: async () => {
    try {
      const response = await api.post('/auth/logout/');
      return {
        success: true,
        message: response.data.message || 'Logged out successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Logout error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Resend OTP
   * Endpoint: POST /auth/resend-otp/
   */
  resendOTP: async (email, purpose) => {
    try {
      const response = await api.post('/auth/resend-otp/', {
        email,
        purpose, // 'password_reset' or 'signup'
      });
      return {
        success: true,
        message: response.data.message || 'OTP sent successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Resend OTP error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Check if email exists
   * Endpoint: POST /auth/check-email/
   */
  checkEmail: async (email) => {
    try {
      const response = await api.post('/auth/check-email/', {
        email,
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Check email error:', error.response?.data);
      throw error;
    }
  },
};

// ============================================
// DASHBOARD API (Admin Panel)
// ============================================
export const dashboardApi = {
  /**
   * Get dashboard statistics
   * Endpoint: GET /admindb/dashboard/stats/
   */
  getStats: async () => {
    try {
      const response = await api.get('/admindb/dashboard/stats/');
      
      // Check if response already has success field
      if (response.data.success !== undefined) {
        return response.data;
      }
      
      // If not, wrap it
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get stats error:', error.response?.data);
      throw error;
    }
  },
};

// ============================================
// USER MANAGEMENT API (Admin Panel)
// ============================================
export const userApi = {
  /**
   * Get list of users with pagination and search
   * Endpoint: GET /admindb/users/
   */
  getUsers: async (page = 1, pageSize = 10, search = '') => {
    try {
      const response = await api.get('/admindb/users/', {
        params: {
          page,
          page_size: pageSize,
          search,
        },
      });
      
      // Check if response already has success field
      if (response.data.success !== undefined) {
        return response.data;
      }
      
      // If not, wrap it
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get users error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Delete a user
   * Endpoint: DELETE /admindb/users/{user_id}/
   */
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admindb/users/${userId}/`);
      
      return {
        success: true,
        message: response.data.message || 'User deleted successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Delete user error:', error.response?.data);
      throw error;
    }
  },
};

// ============================================
// ADMINISTRATOR MANAGEMENT API (Admin Panel)
// ============================================
export const adminApi = {
  /**
   * Get list of administrators
   * Endpoint: GET /admindb/administrators/
   */
  getAdmins: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get('/admindb/administrators/', {
        params: {
          page,
          page_size: pageSize,
        },
      });
      
      // Check if response already has success field
      if (response.data.success !== undefined) {
        return response.data;
      }
      
      // If not, wrap it
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get admins error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Create new administrator
   * Endpoint: POST /admindb/administrators/create/
   */
  createAdmin: async (adminData) => {
    try {
      const response = await api.post('/admindb/administrators/create/', adminData);
      
      return {
        success: true,
        message: response.data.message || 'Administrator created successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Create admin error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Update administrator
   * Endpoint: PUT /admindb/administrators/{admin_id}/
   */
  updateAdmin: async (adminId, adminData) => {
    try {
      const response = await api.put(`/admindb/administrators/${adminId}/`, adminData);
      
      return {
        success: true,
        message: response.data.message || 'Administrator updated successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Update admin error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Delete administrator
   * Endpoint: DELETE /admindb/administrators/{admin_id}/delete/
   */
  deleteAdmin: async (adminId) => {
    try {
      const response = await api.delete(`/admindb/administrators/${adminId}/delete/`);
      
      return {
        success: true,
        message: response.data.message || 'Administrator deleted successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Delete admin error:', error.response?.data);
      throw error;
    }
  },
};

// ============================================
// PROFILE API (Admin Panel)
// ============================================
export const profileApi = {
  /**
   * Get current admin profile
   * Endpoint: GET /admindb/profile/
   */
  getProfile: async () => {
    try {
      const response = await api.get('/admindb/profile/');
      
      // Check if response already has success field
      if (response.data.success !== undefined) {
        return response.data;
      }
      
      // If not, wrap it
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get profile error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Update current admin profile
   * Endpoint: PUT /admindb/profile/
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/admindb/profile/', profileData);
      
      return {
        success: true,
        message: response.data.message || 'Profile updated successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Update profile error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Get user profile (regular user, not admin)
   * Endpoint: GET /auth/profile/
   */
  getUserProfile: async () => {
    try {
      const response = await api.get('/auth/profile/');
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get user profile error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Update user profile (regular user, not admin)
   * Endpoint: PUT /auth/profile/
   */
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile/', profileData);
      
      return {
        success: true,
        message: response.data.message || 'Profile updated successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Update user profile error:', error.response?.data);
      throw error;
    }
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

/**
 * Get current user data from localStorage
 */
export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Clear all auth data and logout
 */
export const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('resetEmail');
  localStorage.removeItem('verifiedOTP');
  localStorage.removeItem('rememberedEmail');
};

/**
 * Save auth data to localStorage
 */
export const saveAuthData = (accessToken, refreshToken, userData) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('userData', JSON.stringify(userData));
};

// Export the axios instance for custom requests if needed
export default api;
