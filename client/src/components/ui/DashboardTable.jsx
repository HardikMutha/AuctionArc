import * as React from "react";
import axios from "axios";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import CustomModal from "./DeleteModal";
import useAuthContext from "../../hooks/useAuthContext";

export default function DashboardTable() {
  const [page, setPage] = React.useState(1);
  const [totalProducts, setTotalProducts] = React.useState(0);
  const [productData, setProductData] = React.useState([{}]);
  const { state } = useAuthContext();
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/product/my-products/${page}`,
        { headers: { Authorization: `Bearer ${state?.token}` } }
      );
      console.log(response.data);
      setProductData([...response.data.products]);
      setTotalProducts(response.data.totalProducts);
    };
    fetchData();
  }, [page]);

  function getImageURL(url) {
    if (!url) return null;
    const tempURL = url.split("upload/");
    const newURL = tempURL[0]
      .concat("upload/c_thumb,h_150,w_150/r_max/")
      .concat(tempURL[1]);
    return newURL;
  }
  return (
    <>
      {totalProducts !== 0 ? (
        <div className="w-full p-6 bg-gray-50 min-h-[50vh] ">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productData &&
                productData.length &&
                productData.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      <img
                        src={getImageURL(
                          product?.images && product?.images?.length
                            ? product?.images[0]
                            : null
                        )}
                        alt="none"
                        className="m-auto mb-5"
                      />
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {product?.name}
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            product?.auctionStatus
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product?.auctionStatus ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 font-semibold mb-2">
                            Listing Price
                          </span>
                          <span className="font-medium text-gray-800">
                            ${product?.listingPrice}
                          </span>
                        </div>

                        {product.currentPrice >= 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 font-semibold">
                              Current Price
                            </span>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span className="font-medium text-gray-800 max-w-[200px] truncate">
                                {product?.currentPrice === 0
                                  ? product?.listingPrice
                                  : product?.currentPrice}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                      <CustomModal productid={product?._id} />
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Showing {productData?.length} of {totalProducts} products
              </span>
              <div className="flex items-center gap-2">
                {page == 1 ? (
                  <button
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-500" />
                  </button>
                ) : (
                  <button className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeft
                      className="h-5 w-5 text-gray-500"
                      onClick={() => {
                        setPage(page - 1);
                      }}
                    />
                  </button>
                )}
                {page == Math.ceil(totalProducts / 3) ? (
                  <button
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                  >
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  </button>
                ) : (
                  <button
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      setPage(page + 1);
                    }}
                  >
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="py-4 font-semibold text-center">
          You have no Listed Products!
        </p>
      )}
    </>
  );
}
