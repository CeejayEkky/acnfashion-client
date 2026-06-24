// frontend/src/pages/Contacts.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitMessage } from "../redux/slices/messageSlice";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaPaperPlane,
  FaWhatsapp,
  FaCheckCircle,
  FaSpinner
} from "react-icons/fa";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Contacts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { submitting } = useSelector((state) => state.messages);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal, .reveal-scale, .reveal-left-strong, .reveal-right-strong')
      .forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    toast.error("Please fill in all required fields");
    return;
  }

  try {
    const result = await dispatch(submitMessage(formData)).unwrap();
    
    if (result.success) {
      // ✅ Navigate to confirmation page with message data
      navigate("/message-sent", {
        state: { 
          messageData: {
            id: result.data._id,
            subject: formData.subject,
            message: formData.message,
          }
        }
      });
    }
  } catch (error) {
    console.error("Submit error:", error);
    toast.error("Failed to send message. Please try again.");
  }
};

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, title: "Visit Us", detail: "123 Fashion St, Lagos", color: "from-blue-500/20 to-blue-400/10" },
    { icon: <FaPhone />, title: "Call Us", detail: "+234 813-700-4669", color: "from-blue-400/20 to-blue-300/10" },
    { icon: <FaEnvelope />, title: "Email", detail: "info@acnfashion.com", color: "from-purple-500/20 to-blue-400/10" },
    { icon: <FaClock />, title: "Hours", detail: "Mon-Fri: 9am - 8pm", color: "from-blue-300/20 to-blue-500/10" },
  ];

  return (
    <main className="aura-bg cyber-grid relative min-h-screen overflow-x-hidden">
      {/* Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="aura-orb-glow" />
        <div className="aura-orb-glow" />
        <div className="aura-orb-glow" />
        <div className="aura-orb-glow" />
        <div className="aura-orb-glow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="aura-float inline-block">
            <span className="text-6xl md:text-7xl">💬</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold gradient-text mt-4">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mt-4 glow-text-strong">
            We're here to help — reach out and let's connect.
          </p>
          <div className="w-24 h-1 bg-linear-to-r from-blue-400 to-blue-600 rounded-full mx-auto mt-6" />
        </div>

        {/* Contact Info */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 stagger-children">
          {contactInfo.map((info, index) => (
            <div key={index} className="aura-card rounded-2xl p-6 text-center group">
              <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${info.color} flex items-center justify-center text-2xl text-blue-500 mx-auto mb-3 icon-pulse group-hover:scale-110 transition-transform duration-300`}>
                {info.icon}
              </div>
              <h3 className="font-semibold text-blue-700">{info.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{info.detail}</p>
            </div>
          ))}
        </div>

        {/* Form + Social */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="reveal-left-strong lg:col-span-2">
            <div className="aura-pulse-border rounded-3xl p-6 md:p-8 bg-white/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold glow-text-strong mb-6 flex items-center gap-2">
                <FaPaperPlane className="text-blue-500 icon-pulse" />
                Send a Message
              </h2>

              {/* ✅ Success Message - Shows instantly after submission */}
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-[popIn_0.5s_ease]">
                  <FaCheckCircle className="text-green-500 text-2xl" />
                  <div>
                    <p className="font-semibold text-green-700">Message Sent! ✅</p>
                    <p className="text-sm text-green-600">We'll get back to you soon.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    placeholder="+234 800 000 0000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    placeholder="How can we help?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    placeholder="Tell us what you're thinking..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-linear-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Your message will be sent directly to our team. We'll respond within 24 hours.
                </p>
              </form>
            </div>
          </div>

          {/* Social & Quick Info */}
          <div className="reveal-right-strong">
            <div className="aura-pulse-border rounded-3xl p-6 md:p-8 bg-white/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold glow-text-strong mb-4">Connect With Us</h2>
              <p className="text-gray-600 text-sm mb-6">
                Follow us for the latest updates, fashion tips, and exclusive offers.
              </p>

              {/* Social Icons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <a href="#" className="social-glow w-full aspect-square rounded-xl bg-gray-50/50 flex items-center justify-center text-gray-600 hover:text-pink-500 hover:bg-pink-50/50 transition-all duration-300 text-2xl border border-gray-100/50">
                  <FaInstagram />
                </a>
                <a href="#" className="social-glow w-full aspect-square rounded-xl bg-gray-50/50 flex items-center justify-center text-gray-600 hover:text-blue-400 hover:bg-blue-50/50 transition-all duration-300 text-2xl border border-gray-100/50">
                  <FaTwitter />
                </a>
                <a href="#" className="social-glow w-full aspect-square rounded-xl bg-gray-50/50 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 text-2xl border border-gray-100/50">
                  <FaFacebook />
                </a>
                <a href="#" className="social-glow w-full aspect-square rounded-xl bg-gray-50/50 flex items-center justify-center text-gray-600 hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-300 text-2xl border border-gray-100/50">
                  <FaLinkedin />
                </a>
                <a href="https://wa.me/2348137004669" target="_blank" rel="noopener noreferrer" className="social-glow w-full aspect-square rounded-xl bg-gray-50/50 flex items-center justify-center text-gray-600 hover:text-green-500 hover:bg-green-50/50 transition-all duration-300 text-2xl border border-gray-100/50">
                  <FaWhatsapp />
                </a>
              </div>

              {/* Quick Contact */}
              <div className="border-t border-blue-100/50 pt-6 space-y-3">
                <h3 className="font-semibold text-blue-700 text-sm uppercase tracking-wider">Quick Response</h3>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-xl">⏱️</span>
                  <span>We respond within 24 hours</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-xl">📞</span>
                  <span>Urgent? Call +234 813-700-4669</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-xl">📍</span>
                  <span>123 Fashion Street, Lagos</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-4 p-3 rounded-xl bg-linear-to-r from-green-50 to-emerald-50 border border-green-200/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-green-700 font-medium">Online — We're here to help!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="reveal-scale mt-8">
          <div className="aura-pulse-border rounded-3xl p-4 bg-white/50 backdrop-blur-sm">
            <div className="w-full h-56 md:h-72 rounded-2xl bg-linear-to-br from-blue-50/80 to-blue-100/50 flex items-center justify-center border border-blue-200/30">
              <div className="text-center">
                <FaMapMarkerAlt className="text-5xl text-blue-400 mx-auto mb-2 icon-pulse" />
                <p className="text-gray-600 font-medium">123 Fashion Street, Lagos, Nigeria</p>
                <p className="text-sm text-gray-400">📍 Find us here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contacts;