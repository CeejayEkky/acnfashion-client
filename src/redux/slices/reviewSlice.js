// frontend/src/redux/slices/reviewSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch all approved reviews
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { productId, limit = 6 } = params;
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/reviews`;
      const query = new URLSearchParams();
      if (productId) query.append("productId", productId);
      if (limit) query.append("limit", limit);
      if (query.toString()) url += `?${query.toString()}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch reviews" });
    }
  }
);

// ✅ Submit a new review
export const submitReview = createAsyncThunk(
  "reviews/submitReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const cleanToken = token?.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to submit review" });
    }
  }
);

// ✅ Admin - Fetch all reviews
export const fetchAllReviewsAdmin = createAsyncThunk(
  "reviews/fetchAllReviewsAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const cleanToken = token?.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/admin`,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch reviews" });
    }
  }
);

// ✅ Admin - Update review
export const updateReviewAdmin = createAsyncThunk(
  "reviews/updateReviewAdmin",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const cleanToken = token?.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
      
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update review" });
    }
  }
);

// ✅ Admin - Delete review
export const deleteReviewAdmin = createAsyncThunk(
  "reviews/deleteReviewAdmin",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const cleanToken = token?.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
      
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${id}`,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to delete review" });
    }
  }
);

// ✅ Mark review as helpful
export const markHelpful = createAsyncThunk(
  "reviews/markHelpful",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/${id}/helpful`
      );
      return { id, helpful: response.data.helpful };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to mark helpful" });
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    total: 0,
    avgRating: 0,
    totalReviews: 0,
    loading: false,
    error: null,
    adminReviews: [],
    submitting: false,
  },
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.total = 0;
      state.avgRating = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews || [];
        state.total = action.payload.total || 0;
        state.avgRating = action.payload.avgRating || 0;
        state.totalReviews = action.payload.totalReviews || 0;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch reviews";
      })
      
      // Submit review
      .addCase(submitReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state) => {
        state.submitting = false;
        // Review will appear after admin approval
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || "Failed to submit review";
      })
      
      // Admin fetch all
      .addCase(fetchAllReviewsAdmin.fulfilled, (state, action) => {
        state.adminReviews = action.payload.reviews || [];
      })
      
      // Admin update
      .addCase(updateReviewAdmin.fulfilled, (state, action) => {
        const index = state.adminReviews.findIndex(r => r._id === action.payload.review._id);
        if (index !== -1) {
          state.adminReviews[index] = action.payload.review;
        }
        // Also update in reviews if present
        const pubIndex = state.reviews.findIndex(r => r._id === action.payload.review._id);
        if (pubIndex !== -1) {
          state.reviews[pubIndex] = action.payload.review;
        }
      })
      
      // Admin delete
      .addCase(deleteReviewAdmin.fulfilled, (state, action) => {
        state.adminReviews = state.adminReviews.filter(r => r._id !== action.payload.id);
        state.reviews = state.reviews.filter(r => r._id !== action.payload.id);
      })
      
      // Mark helpful
      .addCase(markHelpful.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r._id === action.payload.id);
        if (index !== -1) {
          state.reviews[index].helpful = action.payload.helpful;
        }
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;