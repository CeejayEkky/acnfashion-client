// frontend/src/components/WhatsAppButton.js
import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    setIsMobile(window.innerWidth < 768);
    
    // Show button after scrolling
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phoneNumber = "2348084892300"; // Your WhatsApp number
  const message = "Hi! I'm interested in your products. Can you help me?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        fixed z-50 
        ${isMobile ? 'bottom-6 right-4' : 'bottom-8 right-8'}
        ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        transition-all duration-300 ease-in-out
        group
      `}
    >
      <div className="relative">
        {/* Pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
        
        {/* Main button */}
        <div className="relative bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 hover:scale-110">
          <FaWhatsapp className="text-3xl md:text-4xl" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            Chat with us
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-4 border-transparent border-l-gray-800" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;