// frontend/src/redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Load cart from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [], totalPrice: 0 };
};

const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// ✅ Get guest ID from localStorage or create one
const getGuestId = () => {
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = `guest_${Date.now()}`;
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
};

// ✅ FETCH cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const userId = JSON.parse(localStorage.getItem("userInfo"))?._id;
      const guestId = getGuestId();
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          params: { userId, guestId },
        }
      );
      return response.data.cart;
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
      const userId = JSON.parse(localStorage.getItem("userInfo"))?._id;
      const guestId = getGuestId();
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          productId,
          quantity,
          size,
          color,
          userId,
          guestId,
        }
      );
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to add to cart" });
    }
  }
);

// ✅ UPDATE cart item
export const updateCartItQuantity = createAsyncThunk(
  "cart/updateCartItQuantity",
  async ({ productId, quantity, size, color }, { rejectWithValue }) => {
    try {
      const userId = JSON.parse(localStorage.getItem("userInfo"))?._id;
      const guestId = getGuestId();
      
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          productId,
          quantity,
          size,
          color,
          userId,
          guestId,
        }
      );
      return response.data.cart;
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
      const userId = JSON.parse(localStorage.getItem("userInfo"))?._id;
      const guestId = getGuestId();
      
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          data: {
            productId,
            size,
            color,
            userId,
            guestId,
          },
        }
      );
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to remove from cart" });
    }
  }
);

// ✅ MERGE cart (when user logs in)
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const cleanToken = token?.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        { guestId },
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to merge cart" });
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
      state.cart = { products: [], totalPrice: 0 };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { products: [], totalPrice: 0 };
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch cart";
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { products: [], totalPrice: 0 };
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to cart";
      })
      .addCase(updateCartItQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { products: [], totalPrice: 0 };
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update cart";
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { products: [], totalPrice: 0 };
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove from cart";
      })
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { products: [], totalPrice: 0 };
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to merge cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;