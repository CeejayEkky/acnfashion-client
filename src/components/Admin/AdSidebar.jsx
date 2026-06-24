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

  // Fetch pending reviews count
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
    // ✅ FIXED: Sticky sidebar that stays in place
    <div className="w-64 bg-gray-900 text-white h-screen sticky top-0 overflow-y-auto flex-shrink-0">
      <div className="p-6">
        <Link
          style={{ fontFamily: "Candara" }}
          to="/admin"
          className="text-2xl font-bold"
        >
          <div className="mb-6 border rounded-3xl p-4 bg-gray-950 cursor-pointer hover:bg-gray-800 transition">
            A.C.N <br /> Fashion House
          </div>
        </Link>

        <h2 className="text-xl font-medium mb-6 border border-r-0 rounded-bl-2xl rounded-tl-2xl p-2">
          Admin Dashboard
        </h2>

        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 font-bold hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2 transition"
            }
          >
            <FaUser />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 font-bold hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2 transition"
            }
          >
            <FaBoxOpen />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 font-bold hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2 transition"
            }
          >
            <FaClipboardList />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/admin/reviews"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 font-bold hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2 transition"
            }
          >
            <FaStar />
            <span>Reviews</span>
            {pendingCount > 0 && (
              <span className="ml-auto bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/admin/messages"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 font-bold hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2 transition"
            }
          >
            <FaEnvelope />
            <span>Messages</span>
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/discover/all"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
                : "text-gray-300 font-bold hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2 transition"
            }
          >
            <FaStore />
            <span>Store</span>
          </NavLink>
        </nav>

        <div className="mt-6">
          <button
            onClick={handLogout}
            className="cursor-pointer w-full bg-red-500 font-bold hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdSidebar;