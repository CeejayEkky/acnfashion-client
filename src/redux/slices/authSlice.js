// frontend/src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const cleanToken = (token) => {
  if (!token) return null;
  return token.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
};

const initGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initGuestId);

const initialState = {
  user: userFromStorage,
  guestId: initGuestId,
  loading: false,
  error: null,
};

// ✅ LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData
      );
      
      if (response.data.success && response.data.token) {
        const token = cleanToken(response.data.token);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        localStorage.setItem("userToken", token);
        return response.data.user;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      return rejectWithValue({ 
        message: error.response?.data?.message || "Login failed",
      });
    }
  }
);

// ✅ REGISTER
export const regUser = createAsyncThunk(
  "auth/regUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userData
      );
      
      if (response.data.success && response.data.token) {
        const token = cleanToken(response.data.token);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        localStorage.setItem("userToken", token);
        return response.data.user;
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      return rejectWithValue({ 
        message: error.response?.data?.message || "Registration failed",
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`;
      state.error = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", state.guestId);
      toast.success("Logged out successfully");
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        toast.success(`Welcome back, ${action.payload.name}! 🎉`);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Login failed" };
        toast.error(action.payload?.message || "Login failed");
      })
      .addCase(regUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(regUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        toast.success(`Welcome ${action.payload.name}! 🎉`);
      })
      .addCase(regUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Registration failed" };
        toast.error(action.payload?.message || "Registration failed");
      });
  },
});

export const { logout, generateNewGuestId, clearError } = authSlice.actions;
export default authSlice.reducer;