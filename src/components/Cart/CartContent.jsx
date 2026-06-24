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

  return (
    <div className="space-y-4">
      {cart?.products?.map((prod, i) => (
        <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 py-4 border-b border-gray-100">
          {/* ✅ Image - Full width on mobile */}
          <div className="w-full sm:w-20 flex-shrink-0">
            <img
              src={prod.image}
              alt={prod.name}
              className="w-full h-32 sm:h-24 object-cover rounded-lg"
            />
          </div>
          
          {/* ✅ Product Info - Flex on mobile */}
          <div className="flex-1 w-full sm:w-auto">
            <h3 className="font-medium text-gray-800 text-sm sm:text-base">{prod.name}</h3>
            <p className="text-xs text-gray-500">
              Size: {prod.size} | Color: {prod.color}
            </p>
            
            {/* ✅ Quantity - Full width on mobile */}
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
          
          {/* ✅ Price & Delete - Align right on desktop */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              ₦{prod.price?.toLocaleString()}
            </p>
            <button
              onClick={() =>
                hRemoveFromCart(prod.productId, prod.size, prod.color)
              }
              className="text-red-500 hover:text-red-700 transition"
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