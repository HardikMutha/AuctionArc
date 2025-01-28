import { useContext, useEffect, useState } from "react";
import LoginContext from "../contexts/LoginContext";
import axios from "axios";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import "../styles/Homepage.css";

const Homepage = () => {
  const login = useContext(LoginContext);
  const { isFirstTime, setIsFirstTime } = useContext(LoginContext);
  const [AllProducts, setAllProducts] = useState([]);
  const [searchQuery, setsearchQuery] = useState("");
  useEffect(() => {
    async function fetchAllProducts() {
      try {
        const allProducts = await axios.get(
          "http://localhost:3000/all-products",
          { withCredentials: true }
        );
        setAllProducts([...AllProducts, ...allProducts.data]);
      } catch (err) {
        console.log(err);
        toast.error("Error Fetching the Products, Please Try again Later");
      }
    }
    fetchAllProducts();
  }, []);

  return (
    <>
      <Navbar searchQuery={searchQuery} setsearchQuery={setsearchQuery} />
      <div className="mt-[3vw]">
        <h1 className="text-5xl font-semibold text-center m-10 font-[]">
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
          <Grid container spacing={4}>
            {AllProducts.filter((product) =>
              product.name.startsWith(searchQuery)
            ).map((product) => (
              <div key={product._id}>
                <ProductCard productDetails={product} />
              </div>
            ))}
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default Homepage;
