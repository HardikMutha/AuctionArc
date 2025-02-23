import axios from "axios";
import { useEffect } from "react";
const UserBidsComponent = () => {
  const item = {
    name: "Vintage Watch",
    bidAmount: 120.5,
    status: "Winning",
    auctionEnd: "Feb 10, 2025",
    totalBids: 15,
  };
  return (
    <div className="m-5 bg-white shadow-lg rounded-2xl p-4 w-full max-w-md border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
      <div className="mt-2 space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">Bid Amount:</span> $
          {item.bidAmount.toFixed(2)}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Bid Status:</span>
          <span
            className={`ml-1 px-2 py-1 text-sm rounded-full text-white ${
              item.status === "Winning"
                ? "bg-green-500"
                : item.status === "Outbid"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          >
            {item.status}
          </span>
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Auction Ends:</span> {item.auctionEnd}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Total Bids:</span> {item.totalBids}
        </p>
      </div>
    </div>
  );
};

export default UserBidsComponent;
