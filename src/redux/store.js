import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from './slices/productSlice'
import cartReducer from "./slices/cartSlice";
import checkoutReducer from './slices/checkoutSlice'
import orderReducer from './slices/orderSlice'
import adminReducer from './slices/adminSlice'
import adminProdReducer from './slices/adminProdSlice'
import adminOrderReducer from './slices/adminOrderSlice'
import reviewReducer from './slices/reviewSlice';
import messageReducer from './slices/messageSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    adminProducts: adminProdReducer,
    adminOrders: adminOrderReducer,
    products: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderReducer,
    reviews: reviewReducer,
    messages: messageReducer,
  },
});

export default store;
