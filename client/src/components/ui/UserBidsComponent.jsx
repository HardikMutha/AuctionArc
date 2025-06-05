/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
const UserBidsComponent = ({ userBids }) => {
  const navigate = useNavigate();

  return (
    <>
      {userBids?.length != 0 ? (
        <div className="flex flex-wrap gap-5">
          {userBids?.map((userBid) => (
            <div
              className="m-5 bg-white shadow-lg rounded-2xl p-4 w-full sm:w-1/2 md:w-2/3 max-w-md border border-gray-200"
              key={userBid?.product?._id || crypto.randomUUID()}
            >
              <h3 className="text-2xl font-semibold text-gray-800 text-center">
                {userBid?.product?.name}
              </h3>
              <div className="mt-2 space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Your Bid Amount:</span> $
                  {userBid?.bid?.bidAmount.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Current Price</span> $
                  {userBid?.product?.currentPrice}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Bid Status:</span>
                  <span
                    className={`ml-1 px-2 py-1 text-sm rounded-full text-white ${
                      userBid?.product?.currentPrice <= userBid?.bid?.bidAmount
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {userBid?.product?.currentPrice <= userBid?.bid?.bidAmount
                      ? "Winning"
                      : "OutBid"}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Auction Ends:</span>{" "}
                  {new Date(userBid?.product?.duration).toDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Total Bids:</span>{" "}
                  {userBid?.product?.bidHistory.length}
                </p>
                <p className="flex justify-center">
                  <button
                    className="border-[3px] rounded-md p-2 border-green-600 font-semibold "
                    onClick={() =>
                      navigate(`/products/${userBid?.product._id}`)
                    }
                  >
                    View Product
                  </button>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-4 font-semibold text-center">No Bids Placed!</p>
      )}
    </>
  );
};

export default UserBidsComponent;
