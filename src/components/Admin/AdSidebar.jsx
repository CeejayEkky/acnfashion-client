// frontend/src/components/Admin/AdSidebar.js
import React, { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaStore,
  FaUser,
  FaStar,
  FaEnvelope,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { toast } from "sonner";

const AdSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pendingCount, setPendingCount] = useState(0);
  const { unreadCount } = useSelector((state) => state.messages || { unreadCount: 0 });

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const cleanToken = token?.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
        
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/reviews/admin`,
          {
            headers: {
              Authorization: `Bearer ${cleanToken}`,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          const pending = data.reviews?.filter(r => !r.isApproved).length || 0;
          setPendingCount(pending);
        }
      } catch (error) {
        console.error("Failed to fetch pending count:", error);
      }
    };

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
    toast.info("You have been logged out");
  };

  return (
    // ✅ MINIMAL SIDEBAR
    <div className="w-52 bg-gray-900 text-white h-full flex flex-col overflow-y-auto flex-shrink-0">
      <div className="p-3 flex-1">
        {/* Logo */}
        <Link to="/admin" className="block mb-4">
          <div className="border rounded-xl p-2 bg-gray-950 hover:bg-gray-800 transition text-center">
            <span className="text-sm font-bold">A.C.N</span>
            <span className="text-[10px] block text-gray-400">Fashion House</span>
          </div>
        </Link>

        {/* Title */}
        <h2 className="text-[10px] font-medium uppercase tracking-wider text-gray-500 mb-2 px-2">
          Admin Dashboard
        </h2>

        {/* Nav */}
        <nav className="space-y-0.5">
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `py-1.5 px-2.5 rounded flex items-center gap-2.5 text-sm transition ${
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <FaUser className="w-3.5 h-3.5" />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `py-1.5 px-2.5 rounded flex items-center gap-2.5 text-sm transition ${
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <FaBoxOpen className="w-3.5 h-3.5" />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `py-1.5 px-2.5 rounded flex items-center gap-2.5 text-sm transition ${
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <FaClipboardList className="w-3.5 h-3.5" />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/admin/reviews"
            className={({ isActive }) =>
              `py-1.5 px-2.5 rounded flex items-center gap-2.5 text-sm transition ${
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <FaStar className="w-3.5 h-3.5" />
            <span>Reviews</span>
            {pendingCount > 0 && (
              <span className="ml-auto bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {pendingCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/admin/messages"
            className={({ isActive }) =>
              `py-1.5 px-2.5 rounded flex items-center gap-2.5 text-sm transition ${
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <FaEnvelope className="w-3.5 h-3.5" />
            <span>Messages</span>
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/discover/all"
            className={({ isActive }) =>
              `py-1.5 px-2.5 rounded flex items-center gap-2.5 text-sm transition ${
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <FaStore className="w-3.5 h-3.5" />
            <span>Store</span>
          </NavLink>
        </nav>
      </div>

      {/* Logout */}
      <div className="p-2.5 border-t border-gray-700">
        <button
          onClick={handLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded flex items-center justify-center gap-2 text-sm font-medium transition"
        >
          <FaSignOutAlt className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdSidebar;