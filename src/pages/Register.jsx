// frontend/src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { regUser, clearError } from "../redux/slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../assets/cont.jpeg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  // ✅ Redirect when user is registered
  useEffect(() => {
    if (user) {
      console.log("✅ User registered, redirecting to:", redirect);
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || password !== confirmPassword || password.length < 6) {
      return;
    }
    dispatch(clearError());
    await dispatch(regUser({ name, email, password }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 order-2 md:order-1">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 md:p-8 rounded-lg border shadow-sm">
          <div className="flex mb-4 justify-center">
            <h2 className="text-blue-950 text-lg md:text-xl font-medium">A.C.N Fashion House</h2>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-center text-sm md:text-base mb-6">Join us and start shopping!</p>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>
          
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 text-sm"
              placeholder="Min 6 characters"
              required
              disabled={loading}
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <div className="mb-6 relative">
            <label className="block text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 text-sm"
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-800 transition cursor-pointer disabled:opacity-50 text-sm"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          
          <p className="text-sm text-center flex justify-between mt-4">
            <span className="text-gray-600">Already have an account?</span>
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden md:block w-1/2 bg-gray-900 order-1 md:order-2">
        <div className="h-full flex flex-col justify-center items-center">
          <img src={Logo} alt="Register" className="h-full object-cover w-full" />
        </div>
      </div>
    </div>
  );
};

export default Register;