// frontend/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../assets/cont.jpeg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  // ✅ Redirect when user is logged in
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    dispatch(clearError());
    await dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 order-2 md:order-1">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 md:p-8 rounded-lg border shadow-sm">
          <div className="flex mb-4 justify-center">
            <h2 className="text-blue-950 text-lg md:text-xl font-medium">A.C.N Fashion House</h2>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-2">Hey, let's connect!</h2>
          <p className="text-center text-sm md:text-base mb-6">Please provide your login details</p>
          
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
          
          <div className="mb-6 relative">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 text-sm"
              placeholder="Enter your password"
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
          
          <p className="text-sm text-center flex justify-between mt-4">
            <span className="text-gray-600">Don't have an account?</span>
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden md:block w-1/2 bg-gray-900 order-1 md:order-2">
        <div className="h-full flex flex-col justify-center items-center">
          <img src={Logo} alt="Login" className="h-full object-cover w-full" />
        </div>
      </div>
    </div>
  );
};

export default Login;