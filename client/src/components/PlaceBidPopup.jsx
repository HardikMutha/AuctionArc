/* eslint-disable react/prop-types */
import { useState } from "react";
import { X, Gavel } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

function PlaceBidPopup({
  product,
  currentPrice,
  trigger,
  setBidPopup,
  children,
}) {
  const listingPrice = product?.listingPrice
    ? parseInt(product.listingPrice)
    : 0;
  const [price, setPrice] = useState(listingPrice);
  const maxPrice = listingPrice * 2;

  const handleSliderChange = (event) => {
    setPrice(Number(event.target.value));
  };

  const handleInputChange = (event) => {
    const inputValue = Number(event.target.value);
    if (inputValue >= listingPrice && inputValue <= maxPrice) {
      setPrice(inputValue);
    }
  };

  const handleBidRequest = async (event) => {
    event.preventDefault();
    if (!product) {
      toast.error("Product details are missing.");
      return;
    }

    try {
      console.log(product._id);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/product/place-bid/${product._id}`,
        { bidAmount: price },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Bid Placed Successfully");
        setBidPopup(false);
        window.location.reload();
      } else {
        toast.error("Failed to place bid. Please try again.");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          "Error placing bid. Please check your network and try again."
        );
      }
      console.log("Error placing bid:", error);
    }
  };

  if (!product || !trigger) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-[95%] md:w-[600px] h-auto bg-white rounded-2xl p-8 shadow-2xl">
        <button
          onClick={() => setBidPopup(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>

        <h2 className="text-3xl font-bold text-center mt-4 mb-8">
          Place a Bid
        </h2>

        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              Listing Price: ${listingPrice}
            </h3>

            <input
              type="range"
              value={price}
              onChange={handleSliderChange}
              min={currentPrice}
              max={maxPrice}
              step={10}
              className="w-full h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg appearance-none cursor-pointer"
            />

            <input
              type="number"
              value={price}
              onChange={handleInputChange}
              min={listingPrice}
              max={maxPrice}
              step={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter exact price"
            />
          </div>

          <button
            onClick={handleBidRequest}
            className="w-full py-4 px-6 bg-yellow-400 hover:bg-black text-black hover:text-white rounded-full font-semibold transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Gavel className="h-5 w-5" />
            Place Bid!
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default PlaceBidPopup;
