const auctionData = {
  _id: "auction_12345",
  name: "Vintage Rolex Submariner 1680",
  category: "Luxury Watches",
  description:
    "Rare 1970s Rolex Submariner ref. 1680, excellent condition with original box and papers. Serviced in 2023.",
  listingPrice: 8500,
  status: true,
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

const participantsData = [
  {
    id: "user_5678",
    username: "WatchCollector42",
    bidCount: 3,
  },
  {
    id: "user_5679",
    username: "LuxuryBuyer",
    bidCount: 2,
  },
  {
    id: "user_5680",
    username: "VintageHunter",
    bidCount: 1,
  },
  {
    id: "user_5681",
    username: "TimePieces88",
    bidCount: 4,
  },
  {
    id: "user_5682",
    username: "HorologistPro",
    bidCount: 0,
  },
  {
    id: "user_5683",
    username: "SwissWatchFan",
    bidCount: 2,
  },
  {
    id: "user_5684",
    username: "CollectiblesExpert",
    bidCount: 1,
  },
];

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

export const completedAuctionStatus = {
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

export const auctionCompletedMessage = {
  id: "msg_016",
  userId: "system",
  username: "System",
  text: "This auction has been marked as completed by the host. Congratulations to TimePieces88 for winning with a bid of $12,000!",
  timestamp: "2025-05-21T14:00:00Z",
  isSystem: true,
};

const fullData = {
  auction: auctionData,
  participants: participantsData,
  bidHistory: bidHistoryData,
};

export default fullData;
