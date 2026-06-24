// frontend/src/redux/slices/adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// ✅ Helper to get clean token
const getToken = () => {
  const token = localStorage.getItem("userToken");
  if (!token) return null;
  
  let cleanToken = token.trim();
  if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
    cleanToken = cleanToken.slice(1, -1);
  }
  return cleanToken.replace(/\s/g, '');
};

const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found. Please login again.");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ✅ FETCH USERS
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      }
      return rejectWithValue(error.response?.data || { message: "Failed to fetch users" });
    }
  }
);

// ✅ ADD USER - MISSING!
export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.post(
        `${API_URL}/api/admin/users`,
        userData,
        { headers }
      );
      
      toast.success(`User ${userData.name} added successfully! 🎉`);
      
      // ✅ Add user to state immediately, then refetch
      dispatch(addUserToState(response.data.user));
      dispatch(fetchUsers());
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      }
      const errorMsg = error.response?.data?.message || "Failed to add user";
      toast.error(errorMsg);
      return rejectWithValue(error.response?.data || { message: errorMsg });
    }
  }
);

// ✅ UPDATE USER - MISSING!
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, role }, { rejectWithValue, dispatch }) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.put(
        `${API_URL}/api/admin/users/${id}`,
        { role },
        { headers }
      );
      
      toast.success(`User role updated successfully! ✅`);
      
      // ✅ Update user in state immediately, then refetch
      dispatch(updateUserInState(response.data.user));
      dispatch(fetchUsers());
      
      return response.data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      }
      const errorMsg = error.response?.data?.message || "Failed to update user";
      toast.error(errorMsg);
      return rejectWithValue(error.response?.data || { message: errorMsg });
    }
  }
);

// ✅ DELETE USER
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const headers = getAuthHeaders();
      await axios.delete(`${API_URL}/api/admin/users/${id}`, {
        headers,
      });
      
      toast.success("User deleted successfully! 🗑️");
      
      // ✅ IMMEDIATELY remove user from state
      dispatch(removeUserFromState(id));
      
      // ✅ Refetch to ensure consistency
      dispatch(fetchUsers());
      
      return id;
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      }
      const errorMsg = error.response?.data?.message || "Failed to delete user";
      toast.error(errorMsg);
      return rejectWithValue(error.response?.data || { message: errorMsg });
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    // ✅ Add user to state immediately
    addUserToState: (state, action) => {
      state.users.push(action.payload);
    },
    // ✅ Update user in state immediately
    updateUserInState: (state, action) => {
      const updatedUser = action.payload;
      const index = state.users.findIndex((user) => user._id === updatedUser._id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    },
    // ✅ Remove user from state immediately
    removeUserFromState: (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter((user) => user._id !== userId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload || [];
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch users";
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.loading = false;
        // User already added via addUserToState
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add user";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
        // User already updated via updateUserInState
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update user";
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        // User already removed via removeUserFromState
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete user";
      });
  },
});

// ✅ Export all actions
export const { 
  addUserToState, 
  updateUserInState, 
  removeUserFromState 
} = adminSlice.actions;

export default adminSlice.reducer;