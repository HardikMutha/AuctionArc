import { useContext, useEffect, useState } from "react";
import LoginContext from "../contexts/LoginContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import "../styles/Homepage.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const Homepage = () => {
  const login = useContext(LoginContext);
  const [AllProducts, setAllProducts] = useState([]);
  const [searchQuery, setsearchQuery] = useState("");
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await axios.post(
          `http://localhost:3000/auth/authenticate-user`,
          {},
          { withCredentials: true }
        );
        if (response.status == 200) {
          login.setisLoggedIn(true);
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (err) {
        console.log(err);
        toast.error("An Error Occured, Please Login Again");
      }
    }
    checkLogin();
  }, []);
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
      <div className="md:mt-[7vw] mt-[10vw]">
        {login.isLoggedIn ? <h1>You are logged in</h1> : null}
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
        <ToastContainer />
      </div>
    </>
  );
};

export default Homepage;
