import axios from "axios";

// ✅ Get clean token helper
const getCleanToken = () => {
  const token = localStorage.getItem("userToken");
  if (!token) return null;
  
  // Remove whitespace and quotes
  let cleanToken = token.trim();
  if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
    cleanToken = cleanToken.slice(1, -1);
  }
  return cleanToken.replace(/\s/g, '');
};

// ✅ Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor - Adds token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = getCleanToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor - Handles errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.url}`, response.status);
    }
    return response;
  },
  async (error) => {
    // ✅ Handle network errors
    if (!error.response) {
      console.error('❌ Network Error - No response from server');
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
      });
    }

    const { status, data } = error.response;
    const errorMessage = data?.message || 'An error occurred';

    console.error(`❌ API Error ${status}:`, errorMessage);

    // ✅ Handle specific status codes
    switch (status) {
      case 401:
        // Token expired or invalid - logout user
        console.warn('⚠️ Authentication failed. Redirecting to login...');
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        break;
        
      case 403:
        console.error('⛔ Forbidden - Insufficient permissions');
        // Could show a permission error toast
        break;
        
      case 404:
        console.warn('🔍 Resource not found:', error.config.url);
        break;
        
      case 500:
        console.error('💥 Server Error:', errorMessage);
        break;
        
      default:
        break;
    }

    // ✅ Return a clean error object
    return Promise.reject({
      message: errorMessage,
      status: status,
      data: data,
      originalError: error,
    });
  }
);

export default apiClient;