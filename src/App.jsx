import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDets from "./components/Products/ProductDets";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmPg from "./pages/OrderConfirmPg";
import OrdersDetsPg from "./pages/OrdersDetsPg";
import MyOrdersPg from "./pages/MyOrdersPg";
import AdLayout from "./components/Admin/AdLayout";
import AdHomepage from "./pages/AdHomepage";
import UserHandle from "./components/Admin/UserHandle";
import AdProductMgt from "./components/Admin/AdProductMgt";
import EditProductPg from "./components/Admin/EditProductPg";
import CreateProductPg from "./components/Admin/CreateProductPg";
import OrderMgt from "./components/Admin/OrderMgt";
import ReviewManagement from "./components/Admin/ReviewManagement";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import MessageManagement from "./components/Admin/MessageManagement";
import MessageSent from "./pages/MessageSent";
import MessageStatus from "./pages/MessageStatus";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="profile" element={<Profile />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="discover/:collection" element={<CollectionPage />} />
            <Route path="product/:id" element={<ProductDets />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation" element={<OrderConfirmPg />} />
            <Route path="order/:id" element={<OrdersDetsPg />} />
            <Route path="my-orders" element={<MyOrdersPg />} />
            <Route path="message-sent" element={<MessageSent />} />
            <Route path="message-status" element={<MessageStatus />} />
            <Route path="message-status/:id" element={<MessageStatus />} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdHomepage />} />
            <Route path="users" element={<UserHandle />} />
            <Route path="products" element={<AdProductMgt />} />
            <Route path="products/new" element={<CreateProductPg />} /> 
            <Route path="products/:id/edit" element={<EditProductPg />} />
            <Route path="orders" element={<OrderMgt />} />
            <Route path="reviews" element={<ReviewManagement />} />
            <Route path="messages" element={<MessageManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;