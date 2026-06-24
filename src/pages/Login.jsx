import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/cont.jpeg";
import { loginUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // get redirect parameter and check if it's checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const hSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (error) {
      toast.error(
        error.message || "Invalid email or password. Please try again.",
        {
          duration: 3000,
        },
      );
    }
  }, [error]);

  useEffect(() => {
    if (user) {
      toast.success(`Welcome back, ${user.name || 'User'}!`, {
        duration: 2000,
      });
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={hSubmit}
          className="w-full max-w-xl bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex mb-3 justify-center">
            <h2 className="text-blue-950 text-xl font-medium">
              A.C.N Fashion House
            </h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">
            Hey, let's connect!
          </h2>
          <p className="text-center mb-6">Please provide your login details</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error.message || "Invalid email or password"}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className={`w-full text-white p-2 rounded-lg font-semibold transition cursor-pointer ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-800"
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin mr-2">⟳</span>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
          <p className="text-sm text-center flex justify-between mt-4">
            Don't have an account?
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden md:block w-1/2 bg-gray-900">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={Logo}
            alt="Login to account"
            className="h-135 object-cover w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
