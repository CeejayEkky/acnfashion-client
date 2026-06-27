// frontend/src/redux/slices/checkoutSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      // ✅ Format checkout items properly
      const formattedData = {
        checkoutItems: checkoutData.checkoutItems.map(item => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size || 'M',
          color: item.color || 'Black',
        })),
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: checkoutData.paymentMethod || "Flutterwave",
        totalPrice: checkoutData.totalPrice,
      };

      console.log("📤 Sending checkout:", formattedData);

      const token = localStorage.getItem("userToken");
      const cleanToken = token?.trim().replace(/^"|"$/g, '').replace(/\s/g, '');

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success("Checkout created successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Checkout error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to create checkout");
      return rejectWithValue(error.response?.data || { message: "Failed to create checkout" });
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCheckout: (state) => {
      state.checkout = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
        state.error = null;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create checkout";
      });
  },
});

export const { clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;