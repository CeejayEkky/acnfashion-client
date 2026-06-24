// frontend/src/components/Layout/CartDrag.js
import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrag = ({ dragOpen, togCartDrag }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // ✅ Prevent body scroll when cart is open
  useEffect(() => {
    if (dragOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [dragOpen]);

  const hCheckout = () => {
    togCartDrag();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <>
      {/* ✅ Overlay - Full screen, behind cart */}
      {dragOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={togCartDrag}
          style={{ opacity: dragOpen ? 1 : 0 }}
        />
      )}

      {/* ✅ Cart Drawer - Slides from right */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col z-50 ${
          dragOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
          <button
            onClick={togCartDrag}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          <CartContent cart={cart} />
        </div>

        {/* Footer - Sticky bottom */}
        {cart && cart?.products?.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-lg font-bold text-gray-800">
                ₦{cart.totalPrice?.toLocaleString() || 0}
              </span>
            </div>
            <button
              onClick={hCheckout}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition text-sm"
            >
              Proceed to Checkout
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Taxes and shipping calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrag;