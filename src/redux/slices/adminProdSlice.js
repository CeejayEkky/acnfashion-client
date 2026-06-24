// frontend/src/redux/slices/adminProdSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// ✅ Helper to get clean token
const getToken = () => {
  const token = localStorage.getItem("userToken");
  if (!token) return null;
  
  // Remove any whitespace or quotes
  let cleanToken = token.trim();
  if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
    cleanToken = cleanToken.slice(1, -1);
  }
  return cleanToken.replace(/\s/g, '');
};

// ✅ Helper to get auth headers
const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found. Please login again.");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const fetchAdminProds = createAsyncThunk(
  "adminProducts/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/api/admin/products`, {
        headers,
      });
      return response.data;
    } catch (error) {
      // ✅ Handle 401 specifically
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      }
      return rejectWithValue(error.response?.data || { message: "Failed to fetch products" });
    }
  }
);

export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("userToken");
      const cleanToken = token?.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
      
      const response = await axios.post(
        `${API_URL}/api/admin/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      toast.success("Product created successfully! 🎉");
      dispatch(fetchAdminProds()); // Refresh the list
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to create product";
      toast.error(errorMsg);
      return rejectWithValue(error.response?.data || { message: errorMsg });
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const headers = getAuthHeaders();
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers,
      });
      
      toast.success("Product deleted successfully! 🗑️");
      
      // ✅ IMMEDIATELY remove product from state
      dispatch(removeProductFromState(id));
      
      // ✅ Refetch to ensure consistency
      dispatch(fetchAdminProds());
      
      return id;
    } catch (error) {
      // ✅ Handle 401 specifically
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      }
      const errorMsg = error.response?.data?.message || "Failed to delete product";
      toast.error(errorMsg);
      return rejectWithValue(error.response?.data || { message: errorMsg });
    }
  }
);

const adminProdSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    // ✅ IMMEDIATE removal from state
    removeProductFromState: (state, action) => {
      const productId = action.payload;
      state.products = state.products.filter((product) => product._id !== productId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProds.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
        state.error = null;
      })
      .addCase(fetchAdminProds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch products";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
        // Product already removed via removeProductFromState
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete product";
      });
  },
});

export const { removeProductFromState } = adminProdSlice.actions;
export default adminProdSlice.reducer;