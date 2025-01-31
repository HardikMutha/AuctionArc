import { useContext, useEffect, useState } from "react";
import LoginContext from "../contexts/LoginContext";
import axios from "axios";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import InfiniteScroll from "react-infinite-scroll-component";
import "../styles/Homepage.css";
import Spinner from "../components/Spinner";

const Homepage = () => {
  const limit = 3;
  const login = useContext(LoginContext);
  const { isFirstTime, setIsFirstTime } = useContext(LoginContext);
  const [page, setPage] = useState(1);
  const [AllProducts, setAllProducts] = useState([]);
  const [searchQuery, setsearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/all-products-infinite-scroll?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );

      console.log(response.data);

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setAllProducts((prevProducts) => [...prevProducts, ...response.data]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error Fetching the Products, Please Try again Later");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array to run only on initial mount

  // Filter products based on search query
  const filteredProducts = AllProducts.filter((product) =>
    product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar searchQuery={searchQuery} setsearchQuery={setsearchQuery} />
      <div className="mt-[3vw]">
        <h1 className="text-5xl font-semibold text-center m-2 font-[] pt-[6vh]">
          All Products
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
            next={fetchProducts}
            hasMore={hasMore}
            loader={<Spinner />}
            endMessage={
              <p className="m-20 font-extrabold">No more Products Found</p>
            }
          >
            <Box container spacing={4}>
              {filteredProducts.map((product) => (
                <Box item key={product._id}>
                  <ProductCard productDetails={product} />
                </Box>
              ))}
            </Box>
          </InfiniteScroll>
        </Box>
      </div>
    </>
  );
};

export default Homepage;
