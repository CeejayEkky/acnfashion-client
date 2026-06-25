// frontend/src/components/Admin/UserHandle.jsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser, deleteUser, fetchUsers, updateUser } from "../../redux/slices/adminSlice";
import { toast } from "sonner";

const UserHandle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.admin);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // ✅ Real-time polling for new users
  const prevCountRef = useRef(0);
  const firstRunRef = useRef(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchAndCheck = async () => {
      try {
        const result = await dispatch(fetchUsers()).unwrap();
        const currentCount = result?.length || 0;
        if (!firstRunRef.current && currentCount > prevCountRef.current) {
          const newCount = currentCount - prevCountRef.current;
          toast.info(`👤 ${newCount} new user${newCount > 1 ? 's' : ''} registered!`);
        }
        prevCountRef.current = currentCount;
        firstRunRef.current = false;
      } catch (error) {
        // ignore
      }
    };

    // Initial fetch
    fetchAndCheck();

    // Poll every 5 seconds
    const interval = setInterval(fetchAndCheck, 5000);
    return () => clearInterval(interval);
  }, [dispatch, user, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChangeAll = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await dispatch(addUser(formData)).unwrap();
      setFormData({ name: "", email: "", password: "", role: "customer" });
      // Fetch updated list (will be handled by polling)
    } catch (error) {
      toast.error(error?.message || "Failed to add user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRole = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await dispatch(updateUser({ id: userId, role: newRole })).unwrap();
    } catch (error) {
      toast.error(error?.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setDeletingId(userId);
      try {
        await dispatch(deleteUser(userId)).unwrap();
      } catch (error) {
        toast.error(error?.message || "Failed to delete user");
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      
      <div className="p-6 rounded-lg mb-6 bg-gray-50">
        <h3 className="text-lg font-bold mb-4">Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChangeAll}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChangeAll}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChangeAll}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChangeAll}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add User"}
          </button>
        </form>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRole(user._id, e.target.value)}
                      disabled={updatingId === user._id}
                      className="border rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelUser(user._id)}
                      disabled={deletingId === user._id}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm disabled:opacity-50"
                    >
                      {deletingId === user._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserHandle;