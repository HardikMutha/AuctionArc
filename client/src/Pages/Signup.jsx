import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import useAuthContext from "../hooks/useAuthContext";

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const userdata = {
      name: formData.fullName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        userdata
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      setLoading(false);
      dispatch({
        type: "LOGIN",
        payload: { user: response?.data?.user, token: response?.data?.token },
      });
      navigate("/");
    } catch (err) {
      console.log(err);
      console.log(err.response);
      if (err.response?.status == 409) {
        toast.error(err.response.data.message);
      } else toast.error("An Error Occured Please try again");
      setFormData({ fullName: "", username: "", email: "", password: "" });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 lg:p-12">
        <div className="h-full flex flex-col justify-center max-w-xl mx-auto text-white">
          <h1 className="text-4xl lg:text-4xl font-bold mb-8 text-center">
            Join Auction-Arc Today
          </h1>

          <div className="space-y-8">
            <div className="space-y-6">
              <div className="bg-blue-500/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  🌟 Start Bidding Instantly
                </h3>
                <p className="text-blue-100">
                  Create your account and dive into a world of exclusive
                  auctions. Start bidding on unique items from verified sellers
                  worldwide.
                </p>
              </div>

              <div className="bg-blue-500/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  📱 Cross-Platform Access
                </h3>
                <p className="text-blue-100">
                  Access your account from any device. Set up your Account and
                  Start Bidding from Anywhere.
                </p>
              </div>

              <div className="bg-blue-500/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  🏆 Exclusive Benefits
                </h3>
                <p className="text-blue-100">
                  Get access to special auctions, early notifications, and
                  premium features available only to Rada Boyz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 bg-gray-50">
        <div className="h-full flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Create Account
              </h2>
              <p className="mt-2 text-gray-600">
                Join our community of auction enthusiasts
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="johndoe123"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="john@example.com"
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
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Create Account
              </button>

              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  to={"/login"}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in
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

export default SignupPage;
