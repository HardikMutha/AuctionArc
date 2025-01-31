import { Star } from "lucide-react";

const Temp = () => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md mb-4 p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image */}
        <div className="w-full md:w-1/4 flex-shrink-0">
          <img
            src="/api/placeholder/300/300"
            alt="Product"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Product Title
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5"
                      fill={i < 4 ? "#FFB800" : "none"}
                      stroke={i < 4 ? "#FFB800" : "#CBD5E0"}
                    />
                  ))}
                </div>
                <span className="text-gray-600">837 reviews</span>
                <span className="text-gray-500">
                  • 1K+ bought in past month
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">$320.94</p>
              <p className="text-sm text-gray-500">(22 used & new offers)</p>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="mt-4">
            <p className="text-gray-700 leading-relaxed">
              15.6" HD Touchscreen Anti-Glare Laptop, 16GB RAM, 1TB SSD Storage,
              Intel Core Processor up to 4.1GHz, Up to 11 Hours Long Battery
              Life, Type-C, HDMI, Windows 11 Home, Silver
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              See options
            </button>
            <p className="mt-2 text-sm text-gray-500">
              No featured offers available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temp;
