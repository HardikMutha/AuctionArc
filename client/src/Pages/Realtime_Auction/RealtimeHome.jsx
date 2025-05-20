import Navbar from "../../components/Navbar";
import { useState } from "react";
import CreateAuctionModal from "../../components/Realtime/CreateAuctionModal";
import ViewAuctions from "../../components/Realtime/ViewAuctions";

export const RealtimeHome = () => {
  const [joinCode, setJoinCode] = useState("");
  const [showCreateAuction, setShowCreateAuction] = useState(false);
  const [showLiveAuctions, setShowLiveAuctions] = useState(false);

  const onClose = () => setShowCreateAuction(false);
  const onShowLiveClose = () => setShowLiveAuctions(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white">
      <Navbar showSearch={true} />
      <CreateAuctionModal isOpen={showCreateAuction} onClose={onClose} />
      <ViewAuctions isOpen={showLiveAuctions} onClose={onShowLiveClose} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Welcome to Auction Arc - Realtime
          </h1>
          <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
            Join live auctions from anywhere in the world. Bid, win, and connect
            with other collectors and enthusiasts in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-3 bg-white text-cyan-700 font-medium rounded-lg hover:bg-cyan-50 transition-colors"
              onClick={() => setShowCreateAuction(true)}
            >
              Create an Auction
            </button>
            <button
              className="px-8 py-3 bg-cyan-700 text-white font-medium rounded-lg border border-cyan-200 hover:bg-cyan-600 transition-colors"
              onClick={() => setShowLiveAuctions(true)}
            >
              Join an Auction
            </button>
          </div>
        </div>
      </div>
      {/* How It Works Section */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          How Real-Time Auctions Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Create or Join
            </h3>
            <p className="text-gray-600">
              Create your own auction or join an existing one using a unique
              code
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Participate Live
            </h3>
            <p className="text-gray-600">
              Place bids in real-time and watch the auction unfold instantly
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Win & Connect
            </h3>
            <p className="text-gray-600">
              Win items and connect with other collectors in your community
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto pb-16 px-4">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-2xl p-8 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Your Real-Time Auction Journey
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a seller looking to host an exciting auction or
            a buyer searching for unique items, our real-time platform brings
            the thrill of live auctions to your fingertips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-3 bg-white text-cyan-700 font-medium rounded-lg hover:bg-cyan-50 transition-colors"
              onClick={() => setShowCreateAuction(true)}
            >
              Create an Auction
            </button>
            <button
              className="px-8 py-3 bg-cyan-700 text-white font-medium rounded-lg border border-cyan-200 hover:bg-cyan-600 transition-colors"
              onClick={() => setShowLiveAuctions(true)}
            >
              Browse Auctions
            </button>
          </div>
        </div>
      </div>
      <div className="bg-cyan-700 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Join an Auction?
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Enter an auction code to join instantly or browse available auctions
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter auction code"
                className="w-full px-4 py-3 rounded-lg border border-cyan-500 focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300"
              />
            </div>
            <button
              className="px-6 py-3 bg-white text-cyan-700 font-medium rounded-lg hover:bg-cyan-50 transition-colors"
              onClick={() =>
                (window.location.href = `/realtime/join/${joinCode}`)
              }
            >
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
