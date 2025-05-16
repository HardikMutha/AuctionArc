import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import ProductCard from "../components/ProductCard";
import Wishlist from "../components/Wishlist";
import useAuthContext from "../hooks/useAuthContext";

const UserWishlist = () => {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const { state, dispatch } = useAuthContext();

  useEffect(() => {
    async function getWishlist() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/wish-list`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          const wishlistIds = response.data.wishList;

          // Fetch all product details in parallel
          const productPromises = wishlistIds.map((id) =>
            axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/product/products/${id}`,
              {
                withCredentials: true,
              }
            )
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

    // Ensure login is checked before fetching wishlist
    async function init() {
      await getWishlist();
    }

    init();
  }, []);

  return (
    <div>
      {loading ? <Spinner /> : <Wishlist data={state.user} />}

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
};

export default UserWishlist;
