/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Box from "@mui/material/Box";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../components/Spinner";
import useAuthContext from "../hooks/useAuthContext";

const Homepage = () => {
  const limit = 3;
  const [page, setPage] = useState(1);
  const [AllProducts, setAllProducts] = useState([]);
  const [searchQuery, setsearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const { state } = useAuthContext();

  const debouncedFetchProducts = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(async () => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/product/all-products-infinite-scroll?page=${page}&limit=${limit}`,
          { headers: { Authorization: `Bearer ${state?.token}` } }
        );

        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          setAllProducts((prevProducts) => [...prevProducts, ...response.data]);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err) {
        console.log(err);
        toast.error("Error Fetching the Products, Please Try again Later");
      } finally {
        setIsLoading(false);
      }
    }, 1000);

    setTimeoutId(newTimeoutId);
  }, [page, isLoading, timeoutId]);

  useEffect(() => {
    debouncedFetchProducts();
    setHasMore(true);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const filteredProducts = AllProducts.filter((product) =>
    product?.name?.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[100vh] bg-gradient-to-t from-[#f8f9fa] to-[#d9ecef]">
      <Navbar searchQuery={searchQuery} setsearchQuery={setsearchQuery} />
      <div className="pt-[5vh] min-h-[100vh]">
        <h1 className="text-5xl font-semibold text-center m-2 mb-1">
          Live Auctions
        </h1>
        <Box
          sx={{
            width: "80%",
            margin: "0px auto",
            marginBottom: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <InfiniteScroll
            dataLength={filteredProducts.length}
            next={debouncedFetchProducts}
            hasMore={hasMore}
            loader={<Spinner />}
            endMessage={
              <p className="m-20 font-bold text-lg text-center">
                You have Reached the End !!
              </p>
            }
            scrollThreshold={0}
            style={{ overflow: "hidden" }}
          >
            <Box spacing={4} sx={{ width: "80vw" }}>
              {filteredProducts.length === 0 ? (
                <div className="p-10 flex flex-col justify-center align-middle items-center h-[50vh]">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/106/106469.png"
                    alt="No such product"
                    className="w-40 h-40 mb-4"
                  />
                  <h2 className="text-2xl font-semibold text-gray-600">
                    Oops! No products found matching your search...
                  </h2>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <Box item key={product._id} marginX={"auto"}>
                    <ProductCard productDetails={product} />
                  </Box>
                ))
              )}
            </Box>
          </InfiniteScroll>
        </Box>
      </div>
    </div>
  );
};

export default Homepage;
