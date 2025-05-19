import Homepage from "./Pages/Homepage";
import { BrowserRouter, Routes, Route } from "react-router";
import useAuthContext from "./hooks/useAuthContext";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import "react-toastify/dist/ReactToastify.css";
import Userdashboard from "./Pages/Userdashboard";
import SellAProduct from "./Pages/SellAProduct";
import ProductPage from "./Pages/ProductPage";
import UserWishlist from "../src/Pages/UserWishlist";
import AuctionHistoryPage from "./Pages/AuctionHistory";
import Spinner from "./components/Spinner";

function App() {
  const { state } = useAuthContext();
  if (state.isLoading) {
    return <Spinner size={100} />;
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={state?.isAuthenticated ? <Userdashboard /> : <Login />}
          />
          <Route
            path="/sell-new-product"
            element={state?.isAuthenticated ? <SellAProduct /> : <Login />}
          />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route
            path="/wishlist/"
            element={state?.isAuthenticated ? <UserWishlist /> : <Login />}
          />
          <Route path="/temp/" element={<AuctionHistoryPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
