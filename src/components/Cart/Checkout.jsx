// frontend/src/components/Cart/Checkout.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlutterwaveBtn from "./FlutterwaveBtn";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { fetchUserOrders } from "../../redux/slices/orderSlice";
import axios from "axios";
import { toast } from "sonner";
import { getToken } from '../../utils/tokenUtils.js'

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
    console.log("🔄 Checkout mounted");
    console.log("👤 User:", user);
    console.log("🛒 Cart:", cart);
    
    if (!cart || !cart.products || cart.products.length === 0) {
      console.log("⚠️ Cart is empty, redirecting...");
      navigate("/");
    }
  }, [cart, navigate, user]);

  const handleGetCheckout = async (e) => {
    e.preventDefault();
    
    console.log("📝 handleGetCheckout called");
    console.log("👤 User:", user);
    console.log("🛒 Cart:", cart);
    
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
      console.log("📤 Creating checkout with:", {
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "Flutterwave",
        totalPrice: cart.totalPrice,
      });
      
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "Flutterwave",
          totalPrice: cart.totalPrice,
        })
      );
      
      console.log("📥 Create checkout response:", res);
      
      if (res.payload && res.payload._id) {
        console.log("✅ Checkout created with ID:", res.payload._id);
        setCheckoutId(res.payload._id);
        toast.success("Checkout created! Proceed to payment.");
      } else {
        console.error("❌ No checkout ID in response:", res);
        toast.error("Failed to create checkout");
      }
    } catch (error) {
      console.error("❌ Checkout error:", error);
      toast.error("Failed to create checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ PAYMENT SUCCESS - THIS MUST BE CALLED
  const hPaySuccess = async (paymentDetails) => {
    console.log("💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰");
    console.log("💰💰💰 PAYMENT SUCCESS CALLED! 💰💰💰");
    console.log("💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰💰");
    console.log("Payment Details:", paymentDetails);
    console.log("Checkout ID:", checkoutId);
    
    if (!checkoutId) {
      console.error("❌ No checkoutId found!");
      toast.error("No checkout session found");
      return;
    }

    setIsProcessing(true);
    
    try {
      const token = getToken()
      console.log("🔑 Token exists:", !!token);
      console.log("🔑 Token length:", token?.length);

      // ✅ STEP 1: Update payment status
      if (!token) {
        console.error("❌ No token found!");
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      // ✅ STEP 1: Update payment status
      console.log(`📝 Updating payment for checkout: ${checkoutId}`);
      
      const payResponse = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: paymentDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("✅ STEP 1 Complete - Payment updated:", payResponse.data);

      // ✅ STEP 2: Finalize the checkout
      console.log(`📝 STEP 2: Finalizing checkout: ${checkoutId}`);
      
      const finalizeResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("✅✅✅ STEP 2 Complete - FINALIZE RESPONSE:", finalizeResponse.data);
      
      // ✅ STEP 3: Clear the cart
      console.log("📝 STEP 3: Clearing cart...");
      dispatch(clearCart());
      localStorage.removeItem("cart");
      console.log("✅ Cart cleared!");
      
      // ✅ STEP 4: Refresh orders
      console.log("📝 STEP 4: Refreshing orders...");
      await dispatch(fetchUserOrders());
      console.log("✅ Orders refreshed!");
      
      toast.success("Order placed successfully! 🎉");
      
      // ✅ STEP 5: Navigate to orders
      console.log("📝 STEP 5: Navigating to my orders...");
      setTimeout(() => {
        navigate("/my-orders");
      }, 1500);
      
    } catch (error) {
      console.log("❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌");
      console.log("❌❌❌ PAYMENT SUCCESS ERROR! ❌❌❌");
      console.log("❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌");
      console.log("Error object:", error);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);
      console.log("Error message:", error.message);
      
      if (error.response?.status === 404) {
        toast.error("Checkout session expired. Please try again.");
        setCheckoutId(null);
      } else {
        toast.error(error.response?.data?.message || "Payment verification failed. Please contact support.");
      }
      setIsProcessing(false);
    }
  };

  const hPayError = (error) => {
    console.log("❌❌❌ PAYMENT ERROR CALLED ❌❌❌");
    console.error("Payment error:", error);
    toast.error("Payment failed. Please try again.");
    setIsProcessing(false);
  };

  if (loading) return <p>Loading cart ...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  const handleUpdate = (field) => (e) =>
    setShippingAddress((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* ── Left: Form ── */}
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
            {!user?.email && (
              <p className="text-red-500 text-sm mt-1">
                ⚠️ Please login to proceed with payment
              </p>
            )}
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
                className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                disabled={isProcessing || !user}
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
                  onClick={() => {
                    setCheckoutId(null);
                    toast.info("You can edit your shipping details");
                  }}
                  className="w-full mt-3 text-sm text-gray-500 underline"
                >
                  ← Edit shipping details
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* ── Right: Order Summary ── */}
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