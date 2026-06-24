import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/cont.jpeg";
import { regUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";
import { toast } from "sonner";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading } = useSelector((state) => state.auth);
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
    dispatch(regUser({ name, email, password }));
    toast.success(`Welcome ${user?.name}`, {
      duration: 1500
    });
  };

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
          <p className="text-center mb-6">Povide your details to proceed</p>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your name"
            />
          </div>
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
            className="w-full bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-800 transition cursor-pointer"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
          <p className="text-sm text-center flex justify-between mt-4">
            Already have an account?
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden md:block w-1/2 bg-gray-900">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={Logo}
            alt="Register to account"
            className="h-156 object-cover w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
