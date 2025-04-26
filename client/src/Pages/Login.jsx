import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Spinner from "../components/Spinner";
import useAuthContext from "../hooks/useAuthContext";
import { useState } from "react";

const SplitLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state, dispatch } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        userData,
        { withCredentials: true }
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setLoading(false);
      dispatch({
        type: "LOGIN",
        payload: {
          user: response.data?.user,
          token: response.data?.token,
        },
      });
      navigate("/");
    } catch (err) {
      console.log(err.status);
      if (err.status == 409)
        toast.error("Invalid Credentials Please Try Again");
      else if (err.status == 404) toast.error("User Not Found Please Sign Up");
      else toast.error("An Error Occured Please Try Again Later");
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side - App Info */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 lg:p-12">
        <div className="h-full flex flex-col justify-center max-w-xl mx-auto text-white">
          <h1 className="text-4xl lg:text-5xl font-bold mb-8">
            Welcome to Auction Arc
          </h1>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-center">
                A Streamlined Platform for a Seamless Auction Experience
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-500 rounded-lg mr-4">🎯</div>
                  <div>
                    <h3 className="font-semibold mb-1">Live Bidding</h3>
                    <p className="text-blue-100">
                      Experience real-time auctions with instant updates
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 bg-blue-500 rounded-lg mr-4">🔒</div>
                  <div>
                    <h3 className="font-semibold mb-1">Secure Platform</h3>
                    <p className="text-blue-100">
                      Bank-level security for all your personal data.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 bg-blue-500 rounded-lg mr-4">💎</div>
                  <div>
                    <h3 className="font-semibold mb-1">Verified Sellers</h3>
                    <p className="text-blue-100">
                      All sellers are verified to ensure authentic items and
                      safe trading.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-gray-50">
        <div className="h-full flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
              <p className="mt-2 text-gray-600">
                Access your Auction-Arc account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Password..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign In
              </button>

              <p className="text-center text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  to={"/signup"}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign up now
                </Link>
              </p>
              {loading && <Spinner />}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitLoginPage;
