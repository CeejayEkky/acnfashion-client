// frontend/src/components/Layout/CartDrag.js
import React from "react";
import { IoMdClose } from "react-icons/io";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrag = ({ dragOpen, togCartDrag }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const hCheckout = () => {
    togCartDrag();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col z-50 ${
        dragOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* ✅ Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
        <button onClick={togCartDrag} className="p-1 hover:bg-gray-100 rounded-full transition">
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* ✅ Cart Items - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {cart && cart?.products?.length > 0 ? (
          <CartContent cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-4xl mb-2">🛒</p>
            <p className="text-sm">Your cart is empty</p>
            <button
              onClick={togCartDrag}
              className="mt-4 text-blue-500 text-sm hover:underline"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* ✅ Footer - Sticky on mobile */}
      {cart && cart?.products?.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-lg font-bold text-gray-800">
              ₦{cart.totalPrice?.toLocaleString() || 0}
            </span>
          </div>
          <button
            onClick={hCheckout}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition text-sm"
          >
            Checkout
          </button>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            Taxes and shipping calculated at checkout
          </p>
        </div>
      )}
    </div>
  );
};

export default CartDrag;