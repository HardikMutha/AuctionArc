/* eslint-disable react/prop-types */
import { Trophy, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

export const WinnerModal = ({ isOpen, winner, winningBid, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-auto transform transition-all">
        <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 rounded-t-2xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <Trophy className="text-white" size={48} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            🎉 Auction Winner! 🎉
          </h2>
        </div>

        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="text-yellow-500 animate-pulse" size={32} />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Congratulations!
          </h3>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-lg font-medium text-gray-700 mb-1">
              Winner:{" "}
              <span className="text-blue-600 font-semibold">{winner}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              Winning Bid:{" "}
              <span className="text-green-600 font-bold">
                ${winningBid ? winningBid : 1000}
              </span>
            </p>
          </div>
          <p className="text-gray-600 text-sm mb-6">
            The auction has ended successfully. Thank you to all participants!
          </p>

          <button
            onClick={() => {
              onClose();
              navigate("/live-auction");
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
