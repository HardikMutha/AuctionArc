/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Image as ImageIcon, X, DollarSign, Tag, Clock } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import { useNavigate } from "react-router";

export default function ViewAuctions(props) {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("live");
  const navigate = useNavigate();

  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
      fetchAuctions();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [props.isOpen]);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/realtime/all-auctions`
      );
      console.log(response.data.data);
      setAuctions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch auctions:", error);
      toast.error("Failed to load auctions");
      setLoading(false);
    }
  };

  const liveAuctions = auctions.filter((auction) => auction.status === true);
  const completedAuctions = auctions.filter(
    (auction) => auction.status === false
  );

  if (!props?.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-10">
      <div className="bg-gray-50 py-4 px-6 w-full max-w-5xl rounded-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Auctions</h2>
          <button
            onClick={props?.onClose}
            className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X strokeWidth={2} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mt-4">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "live"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("live")}
          >
            Live Auctions
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "completed"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Auctions
          </button>
        </div>

        {/* Auction listings */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
            <p className="ml-3 text-gray-600">Loading auctions...</p>
          </div>
        ) : activeTab === "live" ? (
          liveAuctions.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                No live auctions available
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {liveAuctions.map((auction) => (
                <div
                  key={auction._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {auction.images.length ? (
                      <img
                        src={auction.images[0]}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200">
                        <ImageIcon size={64} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full flex items-center animate-pulse">
                      <span className="w-2 h-2 bg-white rounded-full inline-block mr-2"></span>
                      LIVE
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                      {auction.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
                      {auction.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-gray-600">
                        <Tag size={16} className="mr-1" />
                        <span className="text-sm capitalize">
                          {auction.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center">
                        <DollarSign size={18} className="text-green-600" />
                        <span className="font-bold text-lg text-gray-800">
                          {auction.listingPrice}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`./participant/${auction.auctionCode}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Join Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : completedAuctions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No completed auctions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {completedAuctions.map((auction) => (
              <div
                key={auction._id}
                className="bg-white rounded-lg overflow-hidden shadow-md opacity-75 grayscale"
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {auction.images.length ? (
                    <img
                      src={auction.images[0]}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                      <ImageIcon size={64} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-gray-600 text-white px-3 py-1 rounded-full flex items-center">
                    <Clock size={14} className="mr-1" />
                    COMPLETED
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                    {auction.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
                    {auction.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gray-600">
                      <Tag size={16} className="mr-1" />
                      <span className="text-sm capitalize">
                        {auction.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center">
                      <DollarSign size={18} className="text-green-600" />
                      <span className="font-bold text-lg text-gray-800">
                        {auction.listingPrice}
                      </span>
                    </div>
                    <button
                      disabled
                      className="bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed"
                    >
                      Completed
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
