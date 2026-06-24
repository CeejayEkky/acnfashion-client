import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmPg = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate() 
  const { checkout } = useSelector((state) => state.checkout)

  useEffect(() => {
    if(checkout && checkout._id) {
      dispatch(clearCart())
      localStorage.removeItem("cart")
    } else {
      navigate("/my-orders")
    }
  }, [checkout, navigate, dispatch])

  const calcEstimateDel = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="flex justify-center items-center gap-4 text-4xl font-bold text-emerald-700 mb-8 text-center">
        <FaCheckCircle /> Your Payment was a Success!!!
      </h1>

      {checkout && (
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between mb-10">
            <div>
              <h2 className="text-xl font-semibold">
                Order ID: {checkout._id}
              </h2>
              <p className="text-gray-500">
                Order date: {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-emerald-700 text-sm">
                Estimated Delivery: {calcEstimateDel(checkout.createdAt)}
              </p>
            </div>
          </div>

          <div className="mb-7">
            {checkout.checkoutItems.map((it) => (
              <div key={it.productId} className="flex items-center mb-4">
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h4 className="text-md font-semibold">{it.name}</h4>
                  <p className="text-sm text-gray-500">
                    {it.color} | {it.size}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md">₦{it.price}</p>
                  <p className="text-sm text-gray-500">Qty: {it.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment</h4>
              <p className="text-gray-700">Flutterwave</p>
            </div>

            <div>
                <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                <p className="text-gray-600">
                    {checkout.shippingAddress.address}
                </p>
                <p className="text-gray-600">
                    {checkout.shippingAddress.city},{" "}
                    {checkout.shippingAddress.country}
                </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmPg;
