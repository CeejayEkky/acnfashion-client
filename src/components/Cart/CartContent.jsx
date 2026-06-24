import React from "react";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItQuantity,
} from "../../redux/slices/cartSlice";

const CartContent = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const hAddToCart = (productId, delta, quantity, size, color) => {
    const newQty = quantity + delta;

    if (newQty >= 1) {
      dispatch(
        updateCartItQuantity({
          productId,
          quantity: newQty,
          guestId,
          userId,
          size,
          color,
        }),
      );
    }
  };

  const hRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div>
      {cart.products.map((prod, i) => (
        <div key={i} className="flex items-start justify-between py-4 border-b">
          <div className="flex items-start">
            <img
              src={prod.image}
              alt={prod.name}
              className="w-20 h-24 object-cover mr-4 rounded"
            />
            <div>
              <h3>{prod.name}</h3>
              <p className="text-s text-gray-500">
                size: {prod.size} | color: {prod.color}
              </p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() =>
                    hAddToCart(
                      prod.productId,
                      -1,
                      prod.quantity,
                      prod.size,
                      prod.color,
                    )
                  }
                  className="border rounded px-2 py-0 text-xl font-medium"
                >
                  -
                </button>
                <span className="mx-4">{prod.quantity}</span>
                <button
                  onClick={() =>
                    hAddToCart(
                      prod.productId,
                      1,
                      prod.quantity,
                      prod.size,
                      prod.color,
                    )
                  }
                  className="border rounded px-2 py-0 text-xl font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p>₦ {prod.price.toLocaleString()}</p>
            <button
              onClick={() =>
                hRemoveFromCart(prod.productId, prod.size, prod.color)
              }
            >
              <RiDeleteBin2Line className="h-6 w-6 mt-2 text-red-600 cursor-pointer" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContent;
