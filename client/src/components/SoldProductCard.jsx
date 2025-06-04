/* eslint-disable react/prop-types */
import { useNavigate } from "react-router";
const SoldProductCard = ({ auction }) => {
  const navigate = useNavigate();
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-cyan-100 hover:shadow-lg hover:shadow-cyan-200 transition duration-200">
      <div className="bg-cyan-600 px-4 py-3 text-white">
        <h3 className="font-semibold text-lg truncate">{auction?.name}</h3>
      </div>
      <div className="p-4">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-cyan-600">Date</p>
            <p className="font-medium">
              {new Date(auction?.duration).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-cyan-600">Number of Bids</p>
            <p className="font-medium">{auction?.bidHistory?.length}</p>
          </div>
          <div>
            <p className="text-sm text-cyan-600">Starting Price</p>
            <p className="font-medium">
              {formatCurrency(auction?.listingPrice).length >= 9
                ? formatCurrency(auction?.listingPrice).substring(0, 9) + "..."
                : formatCurrency(auction?.listingPrice)}
            </p>
          </div>
          <div>
            <p className="text-sm text-cyan-600">Final Price</p>
            <p className="font-medium text-cyan-700">
              {formatCurrency(auction?.currentPrice)?.length >= 9
                ? formatCurrency(auction?.currentPrice)?.substring(0, 9) +
                  "...."
                : formatCurrency(auction?.currentPrice)}
            </p>
          </div>
        </div>
        <div className="pt-3 border-t border-cyan-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-cyan-600">Winner</p>
              <p className="font-medium">{auction?.soldTo?.username}</p>
            </div>
            <button
              className="px-3 py-1 text-sm bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition duration-200"
              onClick={() => navigate(`/products/${auction?._id}`)}
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoldProductCard;
