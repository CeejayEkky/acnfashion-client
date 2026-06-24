import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken, setToken, clearAuthData } from "../../utils/tokenUtils";

const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initGuestId)

const initialState = {
    user: userFromStorage,
    guestId: initGuestId,
    loading: false,
    error: null,
}

export const loginUser = createAsyncThunk("auth/loginUser", async (userData, {rejectWithValue}) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/login`, userData
        )

        setToken(response.data.token);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        

        return response.data.user; // returns the user object from the response

    } catch (error) {
        console.error("❌ Login error:", error);
        return rejectWithValue(error.response?.data || { message: "Login failed!. Please try again." });
    }
})

export const regUser = createAsyncThunk("auth/regUser", async (userData, {rejectWithValue}) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData
        )
        setToken(response.data.token);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));

        return response.data.user; // returns the user object from the response

    } catch (error) {
        console.error("❌ Registration error:", error);
        return rejectWithValue(error.response?.data || { message: "Network error. Please try again." });
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}` // reset guestID on logout
            state.error = null;
            clearAuthData();
            localStorage.setItem("guestId", state.guestId);
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}` // reset guestID on logout
            localStorage.setItem("guestId", state.guestId);
        },
        clearError: (state) => { // ✅ Add this
      state.error = null;
    },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        }).addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        }).addCase(regUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(regUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null
        }).addCase(regUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
    }
})

export const {logout, generateNewGuestId, clearError} = authSlice.actions;
export default authSlice.reducer;