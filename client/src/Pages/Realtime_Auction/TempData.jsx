// Placeholder data for Auction Host Interface

// Main auction details
const auctionData = {
  _id: "auction_12345",
  name: "Vintage Rolex Submariner 1680",
  category: "Luxury Watches",
  description:
    "Rare 1970s Rolex Submariner ref. 1680, excellent condition with original box and papers. Serviced in 2023.",
  listingPrice: 8500,
  status: true, // true = live, false = completed
  images: [
    "https://example.com/images/rolex_submariner_1.jpg",
    "https://example.com/images/rolex_submariner_2.jpg",
    "https://example.com/images/rolex_submariner_3.jpg",
  ],
  startTime: "2025-05-20T14:00:00Z",
  estimatedEndTime: "2025-05-21T20:00:00Z",
  hostId: "user_host123",
  hostName: "Premier Auctions",
};

// Auction participants
const participantsData = [
  {
    id: "user_5678",
    username: "WatchCollector42",
    joinedAt: "2025-05-20T14:05:32Z",
    bidCount: 3,
  },
  {
    id: "user_5679",
    username: "LuxuryBuyer",
    joinedAt: "2025-05-20T14:10:15Z",
    bidCount: 2,
  },
  {
    id: "user_5680",
    username: "VintageHunter",
    joinedAt: "2025-05-20T14:12:45Z",
    bidCount: 1,
  },
  {
    id: "user_5681",
    username: "TimePieces88",
    joinedAt: "2025-05-20T14:20:20Z",
    bidCount: 4,
  },
  {
    id: "user_5682",
    username: "HorologistPro",
    joinedAt: "2025-05-20T14:25:10Z",
    bidCount: 0,
  },
  {
    id: "user_5683",
    username: "SwissWatchFan",
    joinedAt: "2025-05-20T14:30:05Z",
    bidCount: 2,
  },
  {
    id: "user_5684",
    username: "CollectiblesExpert",
    joinedAt: "2025-05-20T14:45:30Z",
    bidCount: 1,
  },
];

// Bid history
const bidHistoryData = [
  {
    id: "bid_001",
    userId: "user_5678",
    username: "WatchCollector42",
    amount: 8600,
    timestamp: "2025-05-20T14:10:12Z",
  },
  {
    id: "bid_002",
    userId: "user_5679",
    username: "LuxuryBuyer",
    amount: 8800,
    timestamp: "2025-05-20T14:15:30Z",
  },
  {
    id: "bid_003",
    userId: "user_5680",
    username: "VintageHunter",
    amount: 9000,
    timestamp: "2025-05-20T14:25:45Z",
  },
  {
    id: "bid_004",
    userId: "user_5681",
    username: "TimePieces88",
    amount: 9200,
    timestamp: "2025-05-20T14:30:22Z",
  },
  {
    id: "bid_005",
    userId: "user_5678",
    username: "WatchCollector42",
    amount: 9500,
    timestamp: "2025-05-20T14:45:18Z",
  },
  {
    id: "bid_006",
    userId: "user_5683",
    username: "SwissWatchFan",
    amount: 9700,
    timestamp: "2025-05-20T15:10:05Z",
  },
  {
    id: "bid_007",
    userId: "user_5684",
    username: "CollectiblesExpert",
    amount: 10000,
    timestamp: "2025-05-20T15:25:30Z",
  },
  {
    id: "bid_008",
    userId: "user_5679",
    username: "LuxuryBuyer",
    amount: 10200,
    timestamp: "2025-05-20T15:40:15Z",
  },
  {
    id: "bid_009",
    userId: "user_5681",
    username: "TimePieces88",
    amount: 10500,
    timestamp: "2025-05-20T16:05:22Z",
  },
  {
    id: "bid_010",
    userId: "user_5683",
    username: "SwissWatchFan",
    amount: 10800,
    timestamp: "2025-05-20T16:30:45Z",
  },
  {
    id: "bid_011",
    userId: "user_5678",
    username: "WatchCollector42",
    amount: 11200,
    timestamp: "2025-05-20T16:45:10Z",
  },
  {
    id: "bid_012",
    userId: "user_5681",
    username: "TimePieces88",
    amount: 11500,
    timestamp: "2025-05-20T17:15:33Z",
  },
  {
    id: "bid_013",
    userId: "user_5681",
    username: "TimePieces88",
    amount: 12000,
    timestamp: "2025-05-21T09:10:28Z",
  },
];

// Chat message history
const messagesData = [
  {
    id: "msg_001",
    userId: "system",
    username: "System",
    text: "The auction for 'Vintage Rolex Submariner 1680' has started.",
    timestamp: "2025-05-20T14:00:00Z",
    isSystem: true,
  },
  {
    id: "msg_002",
    userId: "user_5678",
    username: "WatchCollector42",
    text: "Is the original warranty card included with this piece?",
    timestamp: "2025-05-20T14:08:25Z",
  },
  {
    id: "msg_003",
    userId: "host",
    username: "Auction Host",
    text: "Yes, this comes with the original warranty card dated 1973, along with the service papers from 2023.",
    timestamp: "2025-05-20T14:09:40Z",
    isHost: true,
  },
  {
    id: "msg_004",
    userId: "user_5679",
    username: "LuxuryBuyer",
    text: "What's the case diameter?",
    timestamp: "2025-05-20T14:18:15Z",
  },
  {
    id: "msg_005",
    userId: "host",
    username: "Auction Host",
    text: "The case diameter is 40mm, which was standard for this model.",
    timestamp: "2025-05-20T14:19:30Z",
    isHost: true,
  },
  {
    id: "msg_006",
    userId: "user_5680",
    username: "VintageHunter",
    text: "How's the lume on the dial? Any degradation?",
    timestamp: "2025-05-20T14:28:45Z",
  },
  {
    id: "msg_007",
    userId: "host",
    username: "Auction Host",
    text: "The lume has aged to a beautiful creamy patina, consistent across all hour markers. No uneven degradation or repairs.",
    timestamp: "2025-05-20T14:32:10Z",
    isHost: true,
  },
  {
    id: "msg_008",
    userId: "system",
    username: "System",
    text: "A reminder that this auction will continue for approximately 24 hours.",
    timestamp: "2025-05-20T15:00:00Z",
    isSystem: true,
  },
  {
    id: "msg_009",
    userId: "user_5683",
    username: "SwissWatchFan",
    text: "Has the bezel insert been replaced or is it original?",
    timestamp: "2025-05-20T15:15:22Z",
  },
  {
    id: "msg_010",
    userId: "host",
    username: "Auction Host",
    text: "The bezel is original and has some light wear consistent with age, particularly at the 12, 3, and 6 positions.",
    timestamp: "2025-05-20T15:18:05Z",
    isHost: true,
  },
  {
    id: "msg_011",
    userId: "host",
    username: "Auction Host",
    text: "We're seeing some great interest in this piece! The current bid is at $10,000.",
    timestamp: "2025-05-20T15:26:40Z",
    isHost: true,
  },
  {
    id: "msg_012",
    userId: "user_5681",
    username: "TimePieces88",
    text: "Do you have any close-up photos of the dial you can share?",
    timestamp: "2025-05-20T16:10:15Z",
  },
  {
    id: "msg_013",
    userId: "host",
    username: "Auction Host",
    text: "I've just added 3 more high-resolution photos of the dial to the listing. You can see the texture of the matte dial clearly in these new shots.",
    timestamp: "2025-05-20T16:20:30Z",
    isHost: true,
  },
  {
    id: "msg_014",
    userId: "system",
    username: "System",
    text: "The auction will be closing in 4 hours. Current highest bid: $12,000.",
    timestamp: "2025-05-21T09:15:00Z",
    isSystem: true,
  },
  {
    id: "msg_015",
    userId: "host",
    username: "Auction Host",
    text: "As we approach the final hours of this auction, please feel free to ask any last questions about this exceptional timepiece.",
    timestamp: "2025-05-21T10:00:15Z",
    isHost: true,
  },
];

// If you want to simulate a completed auction instead, use this status
const completedAuctionStatus = {
  status: false,
  winningBid: {
    id: "bid_013",
    userId: "user_5681",
    username: "TimePieces88",
    amount: 12000,
    timestamp: "2025-05-21T09:10:28Z",
  },
  completedAt: "2025-05-21T14:00:00Z",
};

// To simulate a completed auction, add this message:
const auctionCompletedMessage = {
  id: "msg_016",
  userId: "system",
  username: "System",
  text: "This auction has been marked as completed by the host. Congratulations to TimePieces88 for winning with a bid of $12,000!",
  timestamp: "2025-05-21T14:00:00Z",
  isSystem: true,
};

// Full dataset to use
const fullData = {
  auction: auctionData,
  participants: participantsData,
  bidHistory: bidHistoryData,
  messages: messagesData,
};

// Export the data
export default fullData;

// Usage example:
// To use this data in your component, you would import it and set your initial states like this:
/*
import auctionPlaceholderData from './auctionPlaceholderData';

// Then in your component:
const [auction, setAuction] = useState(auctionPlaceholderData.auction);
const [participants, setParticipants] = useState(auctionPlaceholderData.participants);
const [bidHistory, setBidHistory] = useState(auctionPlaceholderData.bidHistory);
const [messages, setMessages] = useState(auctionPlaceholderData.messages);
*/
