// frontend/src/utils/axios.js
import axios from "axios";

// ✅ Use the correct backend URL
const API_URL = import.meta.env.VITE_BACKEND_URL || "https://acnfashion-server-1.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      const cleanToken = token.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;