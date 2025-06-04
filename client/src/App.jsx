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
import Spinner from "./components/Spinner";
import { RealtimeHome } from "./Pages/Realtime_Auction/RealtimeHome";
import AuctionHost from "./Pages/Realtime_Auction/Host";
import AuctionHistoryPage from "./Pages/AuctionHistory";
import AuctionParticipant from "./Pages/Realtime_Auction/Participant";
import NotFound from "./Pages/NotFound";

function App() {
  const { state } = useAuthContext();
  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={100} />
      </div>
    );
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
          <Route path="/live-auction/" element={<RealtimeHome />} />
          <Route
            path="/past-auctions"
            element={
              state?.isAuthenticated ? <AuctionHistoryPage /> : <Login />
            }
          />
          <Route
            path="/live-auction/host/:id"
            element={state?.isAuthenticated ? <AuctionHost /> : <Login />}
          />
          <Route
            path="/live-auction/participant/:id"
            element={
              state?.isAuthenticated ? <AuctionParticipant /> : <Login />
            }
          />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
