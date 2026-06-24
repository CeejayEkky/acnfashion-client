// frontend/src/pages/MessageSent.js
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaArrowLeft, FaEnvelope, FaClock } from "react-icons/fa";

const MessageSent = () => {
  const location = useLocation();
  const [messageData, setMessageData] = useState(null);

  useEffect(() => {
    // Get message data from location state
    if (location.state?.messageData) {
      setMessageData(location.state.messageData);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100/30 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-[popIn_0.5s_ease]">
          <FaCheckCircle className="text-5xl text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Message Sent! 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for reaching out! Our team will get back to you within 24 hours.
        </p>
        
        {/* Message Summary */}
        {messageData && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-500 mb-2">Your Message:</p>
            <p className="text-sm font-medium text-gray-800">{messageData.subject}</p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{messageData.message}</p>
          </div>
        )}
        
        {/* What happens next */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-blue-700 font-semibold mb-2">
            💡 What happens next?
          </p>
          <ul className="text-sm text-blue-600 space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Our team will review your message
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              We'll respond within 24 hours
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Check your email for updates
            </li>
          </ul>
        </div>

        {/* Track Message Button */}
        <Link
          to={`/message-status/${messageData?.id || ''}`}
          className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-medium hover:bg-blue-100 transition mb-3 w-full justify-center"
        >
          <FaClock />
          Check Message Status
        </Link>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition w-full justify-center"
        >
          <FaArrowLeft />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default MessageSent;