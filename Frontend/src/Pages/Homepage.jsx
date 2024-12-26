import { useContext, useEffect, useState } from "react";
import LoginContext from "../contexts/LoginContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

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
          localStorage.setItem("user", response.data);
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
    <div>
      {login.isLoggedIn ? <h1>You are logged in</h1> : null}
      <h1>Hello World</h1>
      <input
        type="text"
        name="search-query"
        className="border-2 rounded-md p-2 placeholder:text-red-400"
        placeholder="Search..."
        value={searchQuery}
        onChange={(evt) => {
          console.log("nice");
          setsearchQuery(evt.target.value);
        }}
      />
      <div>
        {AllProducts.filter((product) =>
          product.name.startsWith(searchQuery)
        ).map((product) => (
          <p key={product._id}>{product.name}</p>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Homepage;
