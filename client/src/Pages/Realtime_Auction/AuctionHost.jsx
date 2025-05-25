/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import {
  DollarSign,
  Users,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User,
  Gavel,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import fullData from "./TempData";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import Supabase from "../../config/supabase";

export default function AuctionHost() {
  const { id } = useParams();
  const [auction, setAuction] = useState();
  const [loading, setLoading] = useState(true);
  const [bidHistory, setBidHistory] = useState(fullData.bidHistory);
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState("");
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
  const messagesEndRef = useRef(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();

  const channel = Supabase.channel(`auction:${id}`);

  useEffect(() => {
    checkHost();
    fetchAuctionDetails();
    channel
      .on("broadcast", { event: "participant-message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload.newMessage]);
      })
      .on("broadcast", { event: "participant-join" }, (payload) => {
        setParticipants((prev) => [...prev, payload?.payload?.user]);
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const auctionParticipants = Object.entries(state).map(
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
      .subscribe();
    return () => {
      Supabase.removeChannel(channel);
    };
  }, []);

  const checkHost = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/realtime/check-host`,
        { id },
        { withCredentials: true }
      );
      if (response.status != 200) {
        toast.error("Unauthorized");
        navigate("/live-auction");
      }
    } catch (err) {
      console.log(err);
      toast.error("An Error Ocurred Please Try Again");
      navigate("/live-auction");
    }
  };

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/realtime/auction-details/${id}`
      );
      setAuction(response?.data?.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch auction details:", error);
      toast.error("Failed to load auction details,Make sure it Exists");
      setLoading(false);
    }
  };
  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      userId: "host",
      username: "Auction Host",
      text: message,
      timestamp: new Date().toISOString(),
      isHost: true,
    };
    channel.send({
      type: "broadcast",
      event: "host-message",
      payload: { newMessage },
    });
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  const handleMarkCompleted = async () => {
    setIsCompleting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/realtime/complete-auction`,
        { productId: auction._id, soldTo: "680d5221f7fccbad799d6d88" },
        { withCredentials: true }
      );
      setAuction((prev) => ({ ...prev, status: false }));
      toast.success("Auction marked as completed successfully");
      const completionMessage = {
        id: `msg_${Date.now()}`,
        userId: response?.data?.winner?._id,
        username: response.data.winner.username,
        text: `This auction has been completed, The Winner is ${response.data.winner.username}`,
        timestamp: new Date().toISOString(),
        isSystem: true,
      };
      setMessages((prev) => [...prev, completionMessage]);
    } catch (err) {
      console.log(err);
      toast.error("Failed to complete the auction");
    } finally {
      setIsCompleting(false);
    }
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
        <Spinner />
        <p className="ml-3 text-gray-600">Loading auction...</p>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Auction Not Found
        </h2>
        <p className="text-gray-600">
          The auction you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </div>
    );
  }

  const highestBid =
    bidHistory.length > 0
      ? bidHistory.reduce(
          (max, bid) => (bid.amount > max.amount ? bid : max),
          bidHistory[0]
        )
      : null;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{auction.name}</h1>
            <p className="text-sm text-gray-600">{auction.category}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-gray-700">
              <Users size={18} className="mr-1" />
              <span>{participants.length}</span>
            </div>
            <div className="flex items-center text-green-600">
              <DollarSign size={18} className="mr-1" />
              <span className="font-semibold">
                {highestBid ? highestBid.amount : auction.listingPrice}
              </span>
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
        {/* Left side - Auction details and participants */}
        <div className="w-1/4 bg-gray-50 border-r overflow-y-auto p-4 flex flex-col">
          {/* Auction details */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Auction Details
            </h2>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-600">
                  Starting Price
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  ${auction.listingPrice}
                </p>
              </div>
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-600">
                  Current Highest Bid
                </p>
                <p className="text-lg font-semibold text-green-600">
                  ${highestBid ? highestBid.amount : auction.listingPrice}
                </p>
              </div>
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-600">Total Bids</p>
                <p className="text-lg font-semibold text-gray-800">
                  {bidHistory.length}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p
                  className={`text-lg font-semibold ${
                    auction.status ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {auction.status ? "Active" : "Completed"}
                </p>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="flex-1">
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

          {/* Host Controls */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Host Controls
            </h2>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              {auction.status ? (
                <button
                  onClick={handleMarkCompleted}
                  disabled={isCompleting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center"
                >
                  {isCompleting ? (
                    <>
                      <Spinner className="h-4 w-4 mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} className="mr-2" />
                      Mark as Completed
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center py-2 text-gray-600">
                  <CheckCircle size={18} className="inline-block mr-2" />
                  Auction completed
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Chat and bid history */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Tabs for Chat and Bids */}
          <div className="flex border-b">
            <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium flex items-center">
              <MessageSquare size={16} className="mr-1" />
              Activity Feed
            </button>
          </div>

          {/* Combined chat and bid history feed */}
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
                <div key={item.id} className="mb-4">
                  {item.isBid ? (
                    // Bid notification
                    <div className="bg-blue-50 p-3 rounded-lg inline-block max-w-md">
                      <div className="flex items-center">
                        <Gavel size={16} className="text-blue-500 mr-2" />
                        <span className="font-medium text-blue-700">
                          {item.bid.username}
                        </span>
                        <span className="text-gray-500 text-xs ml-2">
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center">
                        <span className="text-gray-700">Placed a bid for </span>
                        <span className="font-bold text-green-600 ml-1">
                          ${item.bid.amount}
                        </span>
                      </div>
                    </div>
                  ) : item.isSystem ? (
                    <div className="flex justify-center mb-4">
                      <div className="bg-yellow-50 px-4 py-2 rounded-full inline-block">
                        <p className="text-sm text-yellow-800">{item.text}</p>
                      </div>
                    </div>
                  ) : item.isHost ? (
                    <div className="flex justify-end">
                      <div className="bg-blue-600 text-white p-3 rounded-lg inline-block max-w-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">You (Host)</span>
                          <span className="text-blue-200 text-xs ml-2">
                            {formatTimestamp(item.timestamp)}
                          </span>
                        </div>
                        <p>{item.text}</p>
                      </div>
                    </div>
                  ) : (
                    // Participant message
                    <div className="flex">
                      <div className="bg-white p-3 rounded-lg shadow-sm inline-block max-w-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-800">
                            {item.username}
                          </span>
                          <span className="text-gray-500 text-xs ml-2">
                            {formatTimestamp(item.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-700">{item.text}</p>
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
                placeholder="Send a message to all participants..."
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
                This auction is completed. You can no longer send messages.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
