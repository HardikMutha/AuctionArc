import { useState, useEffect } from "react";
import SoldProductCard from "../components/SoldProductCard";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const AuctionHistoryPage = () => {
  const [myAuctions, setMyAuctions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:3000/get-sold-products"
        );
        console.log(response.data.data);
        setMyAuctions([...response.data.data]);
      } catch (err) {
        console.log(err);
        toast.error(err.message);
      }
    }
    fetchData();
  }, []);

  // Filter state
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter and sort auctions
  const filteredAuctions = myAuctions
    .filter(
      (auction) =>
        auction.name.toLowerCase().includes(filter.toLowerCase()) ||
        auction.soldTo.username.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.duration) - new Date(b.duration)
          : new Date(b.duration) - new Date(a.duration);
      } else if (sortBy === "price") {
        return sortOrder === "asc"
          ? a.currentPrice - b.currentPrice
          : b.currentPrice - a.currentPrice;
      }
      return 0;
    });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAuctions = filteredAuctions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAuctions.length / itemsPerPage);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-cyan-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-cyan-800">
              Auction History
            </h1>
            <p className="text-cyan-600 mt-2">Browse all completed auctions</p>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-cyan-700 mb-1"
                >
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by title or winner..."
                  className="w-full px-3 py-2 border border-cyan-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <label
                  htmlFor="sortBy"
                  className="block text-sm font-medium text-cyan-700 mb-1"
                >
                  Sort by
                </label>
                <select
                  id="sortBy"
                  className="w-full px-3 py-2 border border-cyan-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="price">Final Price</option>
                </select>
              </div>
              <div className="w-full md:w-48">
                <label
                  htmlFor="sortOrder"
                  className="block text-sm font-medium text-cyan-700 mb-1"
                >
                  Order
                </label>
                <select
                  id="sortOrder"
                  className="w-full px-3 py-2 border border-cyan-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Auction Cards */}
          <div className="mb-8">
            {currentAuctions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myAuctions.map((auction) => (
                  <SoldProductCard key={auction.id} auction={auction} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                <p className="text-cyan-600">
                  No auctions found matching your criteria.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredAuctions.length > 0 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "bg-cyan-200 text-cyan-700 cursor-not-allowed"
                      : "bg-cyan-500 text-white hover:bg-cyan-600"
                  }`}
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        currentPage === i + 1
                          ? "bg-cyan-600 text-white"
                          : "bg-cyan-100 text-cyan-600 hover:bg-cyan-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "bg-cyan-200 text-cyan-700 cursor-not-allowed"
                      : "bg-cyan-500 text-white hover:bg-cyan-600"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionHistoryPage;
