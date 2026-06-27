// frontend/src/components/Cart/CartContent.js
import React from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItQuantity,
} from "../../redux/slices/cartSlice";

const CartContent = ({ cart }) => {
  const dispatch = useDispatch();

  const hAddToCart = (productId, delta, quantity, size, color) => {
    const newQty = quantity + delta;
    if (newQty >= 1) {
      dispatch(
        updateCartItQuantity({
          productId,
          quantity: newQty,
          size,
          color,
        })
      );
    }
  };

  const hRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, size, color }));
  };

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-sm">Your cart is empty</p>
        <p className="text-xs text-gray-300 mt-1">Start shopping to add items</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.products.map((prod, i) => (
        <div 
          key={i} 
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 py-4 border-b border-gray-100 last:border-0"
        >
          <div className="w-full sm:w-20 shrink-0">
            <img
              src={prod.image}
              alt={prod.name}
              className="w-full h-32 sm:h-24 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
              }}
            />
          </div>
          
          <div className="flex-1 w-full sm:w-auto">
            <h3 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2">
              {prod.name}
            </h3>
            <p className="text-xs text-gray-500">
              Size: {prod.size} | Color: {prod.color}
            </p>
            
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() =>
                  hAddToCart(
                    prod.productId,
                    -1,
                    prod.quantity,
                    prod.size,
                    prod.color
                  )
                }
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-100 transition"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{prod.quantity}</span>
              <button
                onClick={() =>
                  hAddToCart(
                    prod.productId,
                    1,
                    prod.quantity,
                    prod.size,
                    prod.color
                  )
                }
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              ₦{prod.price?.toLocaleString() || 0}
            </p>
            <button
              onClick={() =>
                hRemoveFromCart(prod.productId, prod.size, prod.color)
              }
              className="text-red-400 hover:text-red-600 transition p-1 hover:bg-red-50 rounded-full"
            >
              <RiDeleteBin2Line className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContent;