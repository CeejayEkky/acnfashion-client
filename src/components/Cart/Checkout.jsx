// frontend/src/components/Cart/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlutterwaveBtn from "./FlutterwaveBtn";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import axios from "axios";
import { toast } from "sonner";

const shippingfee = 200;

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [checkoutId, setCheckoutId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleGetCheckout = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to continue");
      navigate("/login?redirect=checkout");
      return;
    }

    if (!cart || cart.products.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);
    
    try {
      const res = await dispatch(createCheckout({
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "Flutterwave",
        totalPrice: cart.totalPrice + shippingfee,
      })).unwrap();
      
      console.log("✅ Checkout response:", res);
      
      if (res && res._id) {
        setCheckoutId(res._id);
        toast.success("Checkout created! Proceed to payment.");
      } else {
        toast.error("Failed to create checkout");
      }
    } catch (error) {
      console.error("❌ Checkout error:", error);
      toast.error(error?.message || "Failed to create checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  const hPaySuccess = async (paymentDetails) => {
    if (!checkoutId) {
      toast.error("No checkout session found");
      return;
    }

    setIsProcessing(true);
    
    try {
      const token = localStorage.getItem("userToken");
      const cleanToken = token?.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
      
      // Update payment status
      const payResponse = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: paymentDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("✅ Payment updated:", payResponse.data);

      // Finalize checkout
      const finalizeResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("✅ Checkout finalized:", finalizeResponse.data);
      
      // ✅ CLEAR CART - FIXED: Use the same token variable, don't redeclare
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/clear`,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      
      // ✅ Also clear Redux cart state
      dispatch(clearCart());
      localStorage.removeItem("cart");
      
      toast.success("Order placed successfully! 🎉");
      navigate("/order-confirmation");
      
    } catch (error) {
      console.error("❌ Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  const hPayError = (error) => {
    console.error("Payment error:", error);
    toast.error("Payment failed. Please try again.");
    setIsProcessing(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p>Loading cart ...</p>
    </div>
  );
  
  if (error) return <p>Error: {error}</p>;
  
  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Your cart is empty.</p>
        <button 
          onClick={() => navigate("/")}
          className="mt-4 bg-black text-white px-6 py-2 rounded"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleUpdate = (field) => (e) =>
    setShippingAddress((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>

        <form onSubmit={handleGetCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-2 border rounded bg-gray-50 cursor-not-allowed"
              disabled
            />
          </div>

          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={handleUpdate("firstName")}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={handleUpdate("lastName")}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={handleUpdate("address")}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={handleUpdate("city")}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={handleUpdate("postalCode")}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={handleUpdate("country")}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={handleUpdate("phone")}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                disabled={isProcessing || !user}
                className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Continue to Payment"}
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay with Flutterwave</h3>
                <FlutterwaveBtn
                  amount={cart.totalPrice + shippingfee}
                  phone={shippingAddress.phone}
                  name={`${shippingAddress.firstName} ${shippingAddress.lastName}`}
                  email={user?.email || ""}
                  checkoutId={checkoutId}
                  onSuccess={hPaySuccess}
                  onError={hPayError}
                />
                <button
                  type="button"
                  onClick={() => setCheckoutId(null)}
                  className="w-full mt-3 text-sm text-gray-500 underline"
                >
                  ← Edit shipping details
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 h-fit">
        <h3 className="text-2xl uppercase mb-6">Order Summary</h3>
        <div className="space-y-4">
          {cart.products.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
                <p className="text-gray-500">{item.color}</p>
              </div>
              <p className="text-xl font-medium">
                ₦{item.price.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="mb-2 mt-4 flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>₦{cart.totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span>Shipping</span>
          <p>₦{shippingfee}</p>
        </div>
        <div className="border-t mt-6 pt-4 flex justify-between items-center text-lg">
          <span>Total</span>
          <p>₦{cart.totalPrice + shippingfee}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;