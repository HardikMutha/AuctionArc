import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import LoginContext from "../contexts/LoginContext";
import Spinner from "../components/Spinner";
import ProductCard from "../components/ProductCard";
import Wishlist from "../components/Wishlist";

const UserWishlist = () => {
  const [loading, setLoading] = useState(true);
  const login = useContext(LoginContext);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    async function getWishlist() {
      try {
        const response = await axios.get(`http://localhost:3000/wish-list`, {
          withCredentials: true,
        });
  
        if (response.status === 200) {
          const wishlistIds = response.data.wishList;
  
          // Fetch all product details in parallel
          const productPromises = wishlistIds.map((id) =>
            axios.get(`http://localhost:3000/products/${id}`, { withCredentials: true })
          );
  
          // Wait for all requests to complete
          const productResponses = await Promise.all(productPromises);
  
          // Extract product data from responses
          const products = productResponses.map((res) => res.data);
  
          // Set the wishlist with product objects
          setWishlist(products);
        }
      } catch (err) {
        console.log(err);
      }
    }
  
    async function checkLogin() {
      try {
        const response = await axios.post(
          `http://localhost:3000/auth/authenticate-user`,
          {},
          { withCredentials: true }
        );
        if (response.status === 200) {
          login.setisLoggedIn(true);
          localStorage.setItem("user", JSON.stringify(response.data));
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    }
  
    // Ensure login is checked before fetching wishlist
    async function init() {
      await checkLogin();
      await getWishlist();
    }
  
    init();
  }, []);
  
  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <Wishlist data={JSON.parse(localStorage.getItem("user"))} />
      )}
  
      <div className="wishlist-items">
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <ProductCard key={item.id} productDetails={item} /> // item is now the product object
          ))
        ) : (
          <p>Your wishlist is empty.</p>
        )}

        {/* {console.log(wishlist)} */}
      </div>
    </div>
  );
}

export default UserWishlist