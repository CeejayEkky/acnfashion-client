// frontend/src/redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axios";

// ✅ Load cart from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

// ✅ Save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// ✅ FETCH cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/api/cart");
      return response.data.cart || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch cart" });
    }
  }
);

// ✅ ADD to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, size, color }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/cart", {
        productId,
        quantity,
        size,
        color,
      });
      return response.data.cart || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to add to cart" });
    }
  }
);

// ✅ UPDATE cart item quantity
export const updateCartItQuantity = createAsyncThunk(
  "cart/updateCartItQuantity",
  async ({ productId, quantity, size, color }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put("/api/cart", {
        productId,
        quantity,
        size,
        color,
      });
      return response.data.cart || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update cart" });
    }
  }
);

// ✅ REMOVE from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, size, color }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete("/api/cart", {
        data: {
          productId,
          size,
          color,
        },
      });
      return response.data.cart || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to remove from cart" });
    }
  }
);

// ✅ MERGE guest cart with user cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/cart/merge", {
        guestId,
      });
      return response.data.cart || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to merge cart" });
    }
  }
);

// ✅ CLEAR cart
export const clearCartThunk = createAsyncThunk(
  "cart/clearCartThunk",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete("/api/cart/clear");
      return response.data.cart || { products: [] };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to clear cart" });
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { products: [] };
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch cart";
      })

      // ✅ Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { products: [] };
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to cart";
      })

      // ✅ Update cart item
      .addCase(updateCartItQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { products: [] };
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update cart";
      })

      // ✅ Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { products: [] };
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove from cart";
      })

      // ✅ Merge cart
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { products: [] };
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to merge cart";
      })

      // ✅ Clear cart
      .addCase(clearCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { products: [] };
        localStorage.removeItem("cart");
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to clear cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;