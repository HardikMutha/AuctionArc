/* eslint-disable no-unused-vars */
// Todo -> Fix Host login as participant
import { useState, useEffect, useRef } from "react";
import {
  DollarSign,
  Users,
  Send,
  CheckCircle,
  MessageSquare,
  User,
  Gavel,
  Trophy,
  Plus,
  LogOut,
} from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import Supabase from "../../config/supabase";
import useAuthContext from "../../hooks/useAuthContext";
import { WinnerModal } from "../../components/Realtime/WinnerModal";
export default function AuctionParticipant() {
  const [auction, setAuction] = useState([]);
  const { state } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState("");
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: `msg_${Date.now()}`,
      userId: "system",
      username: "System",
      text: `The auction has started`,
      timestamp: new Date().toISOString(),
      isSystem: true,
    },
  ]);
  const [bidAmount, setBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const messagesEndRef = useRef(null);
  const { id } = useParams();
  const channel = Supabase.channel(`auction:${id}`, {
    config: { broadcast: { self: false } },
  });
  const highestBid =
    bidHistory.length > 0
      ? bidHistory.reduce(
          (max, bid) => (bid.amount > max.amount ? bid : max),
          bidHistory[0]
        )
      : null;
  const onClose = () => setShowWinnerModal(false);
  const myBids = bidHistory.filter((bid) => bid.userId === state?.user?._id);
  const isWinning = highestBid?.userId === state?.user?._id;
  const minBidAmount = highestBid
    ? highestBid.amount + 50
    : auction.listingPrice + 50;

  const fetchAuctionData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/realtime/auction-details/${id}`
      );
      if (!response.data.data.status) {
        toast.info("The Auction has been already Completed");
        navigate("/live-auction");
      }
      if (response?.data?.data) setLoading(false);
      setAuction(response?.data?.data);
    } catch (error) {
      console.error("Failed to fetch auction details:", error);
      toast.error("Failed to load auction details,Make sure it Exists");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAuctionData();
    channel
      .on("broadcast", { event: "host-message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload.newMessage]);
      })
      .on("broadcast", { event: "participant-message" }, (payload) => {
        console.log(payload.payload.newMessage);
        setMessages((prev) => [...prev, payload.payload.newMessage]);
      })
      .on("broadcast", { event: "auction-completed" }, (payload) => {
        console.log("The auction is completed ", payload);
        setWinner(payload?.payload?.completionMessage?.username);
        setShowWinnerModal(true);
      })
      .on("broadcast", { event: "place-bid" }, (payload) => {
        console.log("Bid Placed ", payload);
        setBidHistory((prev) => [...prev, payload?.payload?.newBid]);
      })
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState();
        const auctionParticipants = Object.entries(presenceState).map(
          ([key, [info]]) => ({
            id: key,
            ...info,
          })
        );
        let data = auctionParticipants.map((participant) => {
          return participant.user;
        });
        setParticipants((prev) => [...data]);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log(`New participant joined: ${key}`, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        console.log(`Participant left: ${key}`);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user: state?.user,
            role: "participant",
          });
        }
      });
    return () => {
      Supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMessage = {
      id: `msg_${Date.now()}`,
      userId: state?.user?._id,
      username: state?.user?.username,
      text: message,
      timestamp: new Date().toISOString(),
    };
    channel.send({
      type: "broadcast",
      event: "participant-message",
      payload: { newMessage },
    });
    setMessage("");
  };

  const placeBid = async () => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount < minBidAmount) {
      alert(`Minimum bid amount is $${minBidAmount}`);
      return;
    }
    setIsPlacingBid(true);
    setTimeout(() => {
      const newBid = {
        id: `bid_${Date.now()}`,
        userId: state?.user?._id,
        username: state?.user?.username,
        amount: amount,
        timestamp: new Date().toISOString(),
      };
      setBidAmount("");
      setShowBidForm(false);
      setIsPlacingBid(false);
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === state?.user?._id ? { ...p, bidCount: p.bidCount + 1 } : p
        )
      );
      channel.send({
        type: "broadcast",
        event: "place-bid",
        payload: { newBid },
      });
    }, 1000);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, bidHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading auction...</p>
      </div>
    );
  }

  return (
    <>
      <WinnerModal
        onClose={onClose}
        isOpen={showWinnerModal}
        winner={winner}
        winningBid={1000}
      />
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b px-4 py-3 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src={
                  auction?.images?.length
                    ? auction?.images[0]
                    : "https://www.istockphoto.com/photos/placeholder-image"
                }
                alt={auction.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {auction?.name}
                </h1>
                <p className="text-sm text-gray-600">{auction?.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center text-gray-700">
                  <Users size={18} className="mr-1" />
                  <span className="font-medium">{participants.length}</span>
                </div>
                <span className="text-xs text-gray-500">Participants</span>
              </div>
              <div className="text-center">
                <div className="flex items-center text-green-600">
                  <DollarSign size={18} className="mr-1" />
                  <span className="font-bold text-lg">
                    {formatCurrency(
                      highestBid ? highestBid?.amount : auction?.listingPrice
                    )}
                  </span>
                </div>
                <span className="text-xs text-gray-500">Current Bid</span>
              </div>
              {auction.status ? (
                <div className="flex items-center">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full inline-block mr-2"></span>
                    LIVE
                  </span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <CheckCircle size={14} className="mr-1" />
                    COMPLETED
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left side - Auction info and bidding */}
          <div className="w-1/3 bg-white border-r overflow-y-auto p-4 flex flex-col">
            {/* Bidding Status */}
            <div className="mb-6">
              <div
                className={`p-4 rounded-lg border-2 ${
                  isWinning
                    ? "bg-green-50 border-green-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">
                    {isWinning ? "You're Winning!" : "Current Status"}
                  </h2>
                  {isWinning && <Trophy className="text-green-600" size={20} />}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Your highest bid:
                    </span>
                    <span className="font-semibold">
                      {myBids.length > 0
                        ? formatCurrency(
                            Math.max(...myBids.map((b) => b.amount))
                          )
                        : "No bids yet"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Current highest:
                    </span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(
                        highestBid?.amount || auction.listingPrice
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Your total bids:
                    </span>
                    <span className="font-semibold">{myBids.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bid Placement */}
            {auction.status && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Place Your Bid
                </h2>
                {!showBidForm ? (
                  <button
                    onClick={() => setShowBidForm(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Gavel size={18} className="mr-2" />
                    Place Bid
                  </button>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bid Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder={minBidAmount.toString()}
                          min={minBidAmount}
                          className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum bid: {formatCurrency(minBidAmount)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowBidForm(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={placeBid}
                        disabled={isPlacingBid || !bidAmount}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm disabled:bg-gray-400 flex items-center justify-center"
                      >
                        {isPlacingBid ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          "Confirm Bid"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Bid Buttons */}
            {auction?.status && !showBidForm && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Quick Bids
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[50, 100, 250, 500].map((increment) => (
                    <button
                      key={increment}
                      onClick={() => {
                        setBidAmount((minBidAmount + increment).toString());
                        setShowBidForm(true);
                      }}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm font-medium border border-blue-200"
                    >
                      <Plus size={12} className="inline mr-1" />${increment}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Participants List */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Participants ({participants.length})
              </h2>
              <div className="bg-white rounded-lg p-2 shadow-sm overflow-y-auto max-h-64">
                {participants.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No participants yet
                  </p>
                ) : (
                  <ul>
                    {participants.map((participant) => (
                      <li
                        key={participant?._id || crypto.randomUUID()}
                        className="px-2 py-2 hover:bg-gray-50 rounded flex items-center"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                          <User size={16} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {participant?.username}
                          </p>
                          <p className="text-xs text-gray-500">
                            {participant?.bidCount || 0} bids
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="mt-auto flex justify-center border-t-2">
              <button
                className="block hover:bg-red-500 p-2 rounded-md mt-2 hover:text-white"
                onClick={() => navigate("/live-auction")}
              >
                <span className="flex">
                  <LogOut className="mr-2" />
                  Exit Auction
                </span>
              </button>
            </div>
          </div>

          {/* Right side - Activity Feed */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Tab header */}
            <div className="flex border-b">
              <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium flex items-center">
                <MessageSquare size={16} className="mr-1" />
                Activity Feed
              </button>
            </div>

            {/* Combined activity feed */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {[
                ...messages,
                ...bidHistory.map((bid) => ({
                  id: bid.id,
                  timestamp: bid.timestamp,
                  isBid: true,
                  bid,
                })),
              ]
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                .map((item) => (
                  <div key={item?.id} className="mb-4">
                    {item?.isBid ? (
                      <div
                        className={`p-3 rounded-lg inline-block max-w-md ${
                          item?.bid.userId === state?.user?._id
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-green-50 border border-green-200"
                        }`}
                      >
                        <div className="flex items-center">
                          <Gavel
                            size={16}
                            className={`mr-2 ${
                              item?.bid?.userId === state?.user?._id
                                ? "text-blue-500"
                                : "text-green-500"
                            }`}
                          />
                          <span
                            className={`font-medium ${
                              item?.bid?.userId === state?.user?._id
                                ? "text-blue-700"
                                : "text-green-700"
                            }`}
                          >
                            {item?.bid?.userId === state?.user?._id
                              ? "You"
                              : item?.bid?.username}
                          </span>
                          <span className="text-gray-500 text-xs ml-2">
                            {formatTimestamp(item?.timestamp)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center">
                          <span className="text-gray-700">
                            Placed a bid for{" "}
                          </span>
                          <span className="font-bold text-green-600 ml-1">
                            {formatCurrency(item?.bid?.amount)}
                          </span>
                        </div>
                      </div>
                    ) : item?.isHost ? (
                      <div className="flex">
                        <div className="bg-orange-100 border border-orange-200 p-3 rounded-lg inline-block max-w-md">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-orange-800 flex items-center">
                              <User size={14} className="mr-1" />
                              {item?.username}
                            </span>
                            <span className="text-orange-600 text-xs ml-2">
                              {formatTimestamp(item?.timestamp)}
                            </span>
                          </div>
                          <p className="text-orange-700">{item?.text}</p>
                        </div>
                      </div>
                    ) : item?.userId === state?.user?._id ? (
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white p-3 rounded-lg inline-block max-w-md">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">You</span>
                            <span className="text-blue-200 text-xs ml-2">
                              {formatTimestamp(item?.timestamp)}
                            </span>
                          </div>
                          <p>{item?.text}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex">
                        <div className="bg-white p-3 rounded-lg shadow-sm inline-block max-w-md border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-800">
                              {item?.username}
                            </span>
                            <span className="text-gray-500 text-xs ml-2">
                              {formatTimestamp(item?.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-700">{item?.text}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="border-t p-3 bg-white">
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Send a message to other participants..."
                  disabled={!auction.status}
                  className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!auction.status || !message.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg disabled:bg-gray-400"
                >
                  <Send size={18} />
                </button>
              </div>
              {!auction.status && (
                <p className="text-sm text-gray-500 mt-2">
                  This auction has ended. You can no longer place bids or send
                  messages.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
