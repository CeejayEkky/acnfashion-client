// frontend/src/pages/Register.js
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { regUser, clearError } from "../redux/slices/authSlice";
import { toast } from "sonner";
import Logo from "../assets/cont.jpeg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, error } = useSelector((state) => state.auth);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  // ✅ Redirect when user is registered
  useEffect(() => {
    if (user) {
      console.log("✅ User registered, redirecting to:", redirect);
      toast.success(`Welcome ${user.name}! 🎉`);
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  // ✅ Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    dispatch(clearError());
    dispatch(regUser({ name, email, password }));
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white p-8 rounded-lg border shadow-sm">
          <div className="flex mb-3 justify-center">
            <h2 className="text-blue-950 text-xl font-medium">A.C.N Fashion House</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-center mb-6">Join us and start shopping!</p>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Min 6 characters"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-800 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          
          <p className="text-sm text-center flex justify-between mt-4">
            Already have an account?
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden md:block w-1/2 bg-gray-900">
        <div className="h-full flex flex-col justify-center items-center">
          <img src={Logo} alt="Register" className="h-full object-cover w-full" />
        </div>
      </div>
    </div>
  );
};

export default Register;