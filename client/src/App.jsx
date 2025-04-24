import Homepage from "./Pages/Homepage";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginContext from "./contexts/LoginContext";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import Userdashboard from "./Pages/Userdashboard";
import SellAProduct from "./Pages/SellAProduct";
import ProductPage from "./Pages/ProductPage";
import { toast } from "react-toastify";
import axios from "axios";
import UserWishlist from "../src/Pages/UserWishlist";
import AuctionHistoryPage from "./Pages/AuctionHistory";

function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await axios.post(
          `http://localhost:3000/auth/authenticate-user`,
          {},
          { withCredentials: true }
        );
        if (response.status == 200) {
          setisLoggedIn(true);
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (err) {
        console.log(err);
        if (isFirstTime) {
          toast.info("Please Login to use all the features", {
            autoClose: 2000,
            position: "top-center",
            theme: "colored",
          });
          setIsFirstTime(false);
        }
      }
    }
    checkLogin();
  }, []);

  return (
    <>
      <LoginContext.Provider
        value={{ isLoggedIn, setisLoggedIn, isFirstTime, setIsFirstTime }}
      >
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Userdashboard /> : <Login />}
            />
            <Route
              path="/sell-new-product"
              element={isLoggedIn ? <SellAProduct /> : <Login />}
            />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route
              path="/wishlist/"
              element={isLoggedIn ? <UserWishlist /> : <Login />}
            />
            <Route path="/temp/" element={<AuctionHistoryPage />} />
          </Routes>
        </BrowserRouter>
      </LoginContext.Provider>
    </>
  );
}

export default App;
