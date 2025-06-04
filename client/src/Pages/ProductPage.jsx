/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GavelIcon from "@mui/icons-material/Gavel";
import TimerIcon from "@mui/icons-material/Timer";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SoldIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import PlaceBidPopup from "../components/PlaceBidPopup";
import useAuthContext from "../hooks/useAuthContext";

export default function ProductPage() {
  const { state, dispatch } = useAuthContext();
  const user = state?.user;
  let userWishList = user?.wishList;
  const navigate = useNavigate();

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [bidPopup, setBidPopup] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0.0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Check if auction is active
  const isAuctionActive = product?.auctionStatus !== false;

  function getImageURL(url) {
    if (!url) return null;
    const tempURL = url.split("upload/");
    const newURL = tempURL[0].concat("upload/w_350,h_350/").concat(tempURL[1]);
    return newURL;
  }

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  function updateWishList() {
    if (!isAuctionActive) {
      toast.info("This auction has ended. Cannot modify wishlist.");
      return;
    }
    userWishList?.includes(id) ? removeFromWishlist() : addToWishList();
  }

  async function addToWishList() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/wish-list/add-to-wishlist/${id}`,
        null,
        { headers: { Authorization: `Bearer ${state?.token}` } }
      );
      userWishList.push(id);
      dispatch({
        type: "UPDATE_WISHLIST",
        payload: userWishList,
      });
      if (response.status === 200) {
        toast.success("Product added to Wishlist");
      }
    } catch (err) {
      console.log(err);
      if (err.status == 401) toast.warn("Please Login to use Wishlist");
      else toast.warn(err.response.data);
    }
  }

  async function removeFromWishlist() {
    const response = await axios.post(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/wish-list/remove-from-wishlist/${id}`,
      null,
      { headers: { Authorization: `Bearer ${state?.token}` } }
    );
    if (response.status == 200) {
      toast.success(response.data.msg);
      userWishList.splice(userWishList.indexOf(id), 1);
      dispatch({
        type: "UPDATE_WISHLIST",
        payload: userWishList,
      });
    } else {
      toast.error(response.data.msg);
    }
  }

  const renderBidPopup = () => {
    if (!isAuctionActive) {
      toast.info("This auction has ended. Cannot place bids.");
      return;
    }
    setBidPopup(true);
  };

  const fetchAllData = async () => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/product/products/${id}`
        );
        if (response.status == 404) {
          navigate("/not-found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        toast.error("Error Fetching Product");
        console.error("Error Fetching Product : ", error);
      }
    };

    const getSimilarProducts = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/product/get-similar-products/${id}`
        );
        setSimilarProducts(response.data);
      } catch (err) {
        console.log(err);
        toast.error(err?.message);
      }
    };

    const fetchCurrentPrice = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/product/get-current-price/${id}`
      );
      setCurrentPrice(response.data.price);
    };
    await fetchProduct();
    await getSimilarProducts();
    await fetchCurrentPrice();
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <PlaceBidPopup
        product={product}
        trigger={bidPopup}
        setBidPopup={setBidPopup}
      />
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="relative flex items-center justify-center">
              <div
                className={`aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative group w-[75%] h-[75%] ${
                  !isAuctionActive ? "opacity-75" : ""
                }`}
              >
                <img
                  src={
                    product?.images?.[currentImageIndex]
                      ? `${getImageURL(product?.images?.[currentImageIndex])}`
                      : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                  }
                  alt="product"
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    !isAuctionActive ? "grayscale" : ""
                  }`}
                />

                {/* Sold Overlay */}
                {!isAuctionActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl transform rotate-12">
                      <div className="flex items-center gap-3">
                        <SoldIcon className="w-8 h-8" />
                        <span className="text-2xl font-bold">SOLD</span>
                      </div>
                    </div>
                  </div>
                )}

                {product?.images?.length > 1 && isAuctionActive && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRightIcon className="w-6 h-6 text-gray-700" />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentImageIndex
                              ? "bg-blue-600 scale-125"
                              : "bg-white/70 hover:bg-white/90"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <h1
                    className={`text-4xl lg:text-5xl font-bold leading-tight text-center flex-1 ${
                      !isAuctionActive ? "text-gray-500" : "text-gray-900"
                    }`}
                  >
                    {product?.name || "Product Name"}
                  </h1>
                  {!isAuctionActive && (
                    <div className="bg-red-100 border border-red-300 rounded-full px-4 py-2">
                      <span className="text-red-700 font-semibold text-sm">
                        AUCTION ENDED
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium ${
                      !isAuctionActive
                        ? "bg-gray-100 border-gray-200 text-gray-500"
                        : "bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200 text-blue-800"
                    }`}
                  >
                    <LocalOfferIcon className="w-4 h-4" />
                    {product?.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <p
                  className={`text-lg leading-relaxed ${
                    !isAuctionActive ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  {product?.description || "Product description"}
                </p>
              </div>

              {/* Pricing */}
              <div
                className={`rounded-2xl p-6 border ${
                  !isAuctionActive
                    ? "bg-gray-50 border-gray-200"
                    : "bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium ${
                        !isAuctionActive ? "text-gray-500" : "text-gray-600"
                      }`}
                    >
                      Listing Price:
                    </span>
                    <span
                      className={`text-2xl font-bold line-through ${
                        !isAuctionActive ? "text-gray-400" : "text-gray-400"
                      }`}
                    >
                      ${product?.listingPrice || "0.00"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-semibold text-lg ${
                        !isAuctionActive ? "text-gray-600" : "text-gray-900"
                      }`}
                    >
                      {!isAuctionActive ? "Final Price:" : "Current Price:"}
                    </span>
                    <span
                      className={`text-3xl font-bold ${
                        !isAuctionActive ? "text-gray-600" : "text-green-600"
                      }`}
                    >
                      $
                      {product?.currentPrice || product?.listingPrice || "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div
                className={`flex items-center gap-3 rounded-xl p-4 border ${
                  !isAuctionActive
                    ? "text-red-600 bg-red-50 border-red-200"
                    : "text-orange-600 bg-orange-50 border-orange-200"
                }`}
              >
                <TimerIcon className="w-6 h-6" />
                <span className="font-semibold text-lg">
                  {!isAuctionActive ? "Auction ended on: " : "Auction ends: "}
                  {product?.duration?.slice(0, 10) || "N/A"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                    !isAuctionActive
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white hover:scale-105 hover:shadow-xl active:scale-95"
                  }`}
                  onClick={updateWishList}
                  disabled={!isAuctionActive}
                >
                  <FavoriteBorderIcon className="w-5 h-5" />
                  {!isAuctionActive
                    ? "Auction Ended"
                    : userWishList?.includes(id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>

                <button
                  className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                    !isAuctionActive
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black hover:scale-105 hover:shadow-xl active:scale-95 hover:text-white"
                  }`}
                  onClick={renderBidPopup}
                  disabled={!isAuctionActive}
                >
                  <GavelIcon className="w-5 h-5" />
                  {!isAuctionActive ? "Bidding Closed" : "Place Bid"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="bg-white/50 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Similar Products
            </h2>
            <p className="text-xl text-gray-600">
              More items like &quot;{product?.name}&quot;
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-6"></div>
          </div>

          <div className="gap-8">
            {similarProducts && similarProducts.length > 0 ? (
              similarProducts.map((similarProduct) => (
                <div
                  key={similarProduct._id}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <ProductCard productDetails={similarProduct} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <LocalOfferIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    No Similar Products Found
                  </h3>
                  <p className="text-gray-600">
                    We couldn&apos;t find any products similar to this one at
                    the moment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
