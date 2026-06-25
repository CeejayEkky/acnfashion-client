// frontend/src/components/Admin/OrderMgt.jsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus, deleteOrders } from "../../redux/slices/adminOrderSlice";
import { toast } from "sonner";
import { FaSearch, FaTrash, FaFilter } from "react-icons/fa";

const OrderMgt = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  // ✅ Real-time polling for new orders
  const prevCountRef = useRef(0);
  const firstRunRef = useRef(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchAndCheck = async () => {
      try {
        const result = await dispatch(fetchAllOrders()).unwrap();
        const currentCount = result?.length || 0;
        if (!firstRunRef.current && currentCount > prevCountRef.current) {
          const newCount = currentCount - prevCountRef.current;
          toast.info(`📦 ${newCount} new order${newCount > 1 ? 's' : ''} placed!`);
        }
        prevCountRef.current = currentCount;
        firstRunRef.current = false;
      } catch (error) {
        // ignore
      }
    };

    fetchAndCheck();
    const interval = setInterval(fetchAndCheck, 5000);
    return () => clearInterval(interval);
  }, [dispatch, user, navigate]);

  const handStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await dispatch(updateOrderStatus({ id: orderId, status })).unwrap();
      toast.success(`Order status updated to "${status}"! ✅`);
    } catch (error) {
      toast.error(error?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order permanently?")) {
      setDeletingId(orderId);
      try {
        await dispatch(deleteOrders(orderId)).unwrap();
        toast.success("Order deleted successfully! 🗑️");
      } catch (error) {
        toast.error(error?.message || "Failed to delete order");
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Filter orders
  const filteredOrders = orders?.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      order._id?.toLowerCase().includes(searchLower) ||
      order.user?.name?.toLowerCase().includes(searchLower) ||
      order.user?.email?.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

  if (loading && !orders) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error}</p>
        <button onClick={() => dispatch(fetchAllOrders())} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-2xl font-bold">Order Management</h2>
        {orders?.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Delete ALL orders?")) {
                // Implement bulk delete if needed
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
          >
            Delete All
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex-1 min-w-[200px] relative">
          <input
            type="text"
            placeholder="Search by Order ID, Customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500">
          Found {filteredOrders?.length || 0} order{filteredOrders?.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Order ID</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Total</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders?.length > 0 ? (
              filteredOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-medium text-gray-900 text-sm">#{ord._id?.slice(-8)}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{ord.user?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-400">{ord.user?.email || ""}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">₦{ord.totalPrice?.toFixed(2) || "0.00"}</td>
                  <td className="py-3 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handStatusChange(ord._id, e.target.value)}
                      disabled={updatingId === ord._id}
                      className={`text-xs rounded-full px-3 py-1 border-0 font-medium focus:ring-2 focus:ring-blue-500 ${
                        ord.status === "Delivered" ? "bg-green-100 text-green-700" :
                        ord.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                        ord.status === "Cancelled" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    {updatingId === ord._id && <span className="ml-2 text-xs text-blue-500">Updating...</span>}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handDeleteOrder(ord._id)}
                      disabled={deletingId === ord._id}
                      className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  {searchTerm || statusFilter !== "all" ? "No orders match your search" : "No orders found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderMgt;