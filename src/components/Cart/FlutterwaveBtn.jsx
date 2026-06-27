// frontend/src/components/Cart/FlutterwaveBtn.js
import React from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import Jack from '../../assets/icon.png';

const FlutterwaveBtn = ({ 
  amount, 
  onSuccess, 
  onError, 
  phone, 
  name, 
  email,
  checkoutId
}) => {
  // Make sure amount is valid
  const paymentAmount = Number(amount) || 0;
  const shippingfee = 200
  const config = {
    public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
    tx_ref: `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    amount: paymentAmount,
    currency: "NGN",
    payment_options: "card,banktransfer,ussd",
    customer: {
      email: email || "customer@example.com",
      phone_number: phone || "",
      name: name || "Customer",
    },
    customizations: {
      title: "ACN Fashion House",
      description: "Payment for order",
      logo: Jack,
    },
    meta: {
      checkout_id: checkoutId || "",
    },
  };

  console.log("💳 Flutterwave Config:", config);

  const handleFlutterPayment = useFlutterwave(config);

  // ✅ WRAPPER FUNCTION TO ENSURE CALLBACKS ARE CALLED
  const handlePayment = () => {
    console.log("🔄 Initiating Flutterwave payment...");
    console.log("📦 Checkout ID being sent:", checkoutId);
    
    handleFlutterPayment({
      callback: (response) => {
        console.log("💳💳💳 FLUTTERWAVE CALLBACK RECEIVED 💳💳💳");
        console.log("Full response:", JSON.stringify(response, null, 2));
        console.log("Response status:", response.status);
        console.log("Transaction ID:", response.transaction_id);
        console.log("Tx Ref:", response.tx_ref);
        console.log("Checkout ID from meta:", checkoutId);
        
        // ✅ IMPORTANT: Close the modal first
        closePaymentModal();
        
        // ✅ Check if payment was successful
        if (response.status === "successful") {
          console.log("✅✅✅ PAYMENT SUCCESSFUL! Calling onSuccess...");
          
          // ✅ Call onSuccess with the full response
          if (onSuccess && typeof onSuccess === "function") {
            onSuccess(response);
          } else {
            console.error("❌ onSuccess is not a function!");
          }
        } else {
          console.log("❌ Payment failed or cancelled");
          console.log("Status:", response.status);
          console.log("Message:", response.message);
          
          if (onError && typeof onError === "function") {
            onError(response);
          }
        }
      },
      onClose: () => {
        console.log("❌ Flutterwave modal closed by user");
        console.log("⚠️ No callback was triggered - user closed the modal");
        
        // ✅ Notify the parent that the modal was closed
        if (onError && typeof onError === "function") {
          onError({ status: "cancelled", message: "Payment modal closed by user" });
        }
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!paymentAmount || paymentAmount <= 0 || !checkoutId}
    >
      {!checkoutId ? "Loading..." : `Pay ₦${paymentAmount.toLocaleString()}`}
    </button>
  );
};

export default FlutterwaveBtn;