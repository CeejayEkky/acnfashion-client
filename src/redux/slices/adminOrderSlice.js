// frontend/src/redux/slices/adminOrderSlice.js
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

export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No token found");
      }
      
      const response = await axios.get(`${API_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      }
      return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue, dispatch }) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No token found");
      }
      
      const response = await axios.put(
        `${API_URL}/api/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      // ✅ Update in state immediately
      dispatch(updateOrderInState(response.data));
      toast.success(`Order status updated to "${status}"! ✅`);
      dispatch(fetchAllOrders());
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      }
      
      const errorMsg = error.response?.data?.message || "Failed to update order status";
      toast.error(errorMsg);
      return rejectWithValue(error.response?.data || { message: errorMsg });
    }
  }
);

// ✅ DELETE ORDER - ADD THIS
export const deleteOrders = createAsyncThunk(
  "adminOrders/deleteOrders",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No token found");
      }
      
      await axios.delete(
        `${API_URL}/api/admin/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // ✅ Remove from state immediately
      dispatch(removeOrderFromState(id));
      toast.success("Order deleted successfully! 🗑️");
      dispatch(fetchAllOrders());
      
      return id;
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      }
      
      const errorMsg = error.response?.data?.message || "Failed to delete order";
      toast.error(errorMsg);
      return rejectWithValue(error.response?.data || { message: errorMsg });
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // ✅ Update order in state
    updateOrderInState: (state, action) => {
      const updatedOrder = action.payload;
      const index = state.orders.findIndex((order) => order._id === updatedOrder._id);
      if (index !== -1) {
        state.orders[index] = updatedOrder;
      }
    },
    // ✅ Remove order from state
    removeOrderFromState: (state, action) => {
      const orderId = action.payload;
      state.orders = state.orders.filter((order) => order._id !== orderId);
      state.totalOrders = state.orders.length;
      state.totalSales = state.orders.reduce((sum, order) => sum + order.totalPrice, 0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || [];
        state.totalOrders = action.payload?.length || 0;
        state.totalSales = action.payload?.reduce((acc, ord) => acc + ord.totalPrice, 0) || 0;
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update order";
      })
      // ✅ Delete order
      .addCase(deleteOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrders.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete order";
      });
  },
});

export const { updateOrderInState, removeOrderFromState } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;