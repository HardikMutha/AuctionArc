import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import ProductCard from "../components/ProductCard";
import Wishlist from "../components/Wishlist";
import useAuthContext from "../hooks/useAuthContext";
import Navbar from "../components/Navbar";

const UserWishlist = () => {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const { state, dispatch } = useAuthContext();
  const data = state.user;
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
    <div className="min-h-[100vh] bg-gradient-to-t from-[#f8f9fa] to-[#d9ecef]">
      {/* {loading ? <Spinner /> : <Wishlist data={state.user} />} */}
      <div>
      <Navbar showSearch={false} />
      <h1 className="pt-20 md:text-5xl font-bold text-center text-3xl mb-10">
        Welcome to {data.username}&apos;s Wishlist
      </h1>
    </div>
      <div className="wishlist-items">
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <ProductCard key={item.id} productDetails={item} /> // item is now the product object
          ))
        ) : (
          <div className="p-10 flex flex-col justify-center align-middle items-center h-[50vh]">
            <img
              src="https://png.pngtree.com/png-clipart/20250203/original/pngtree-cart-empty-vector-png-image_20275977.png"
              alt="empty wishlist"
              className="w-40 h-40 mb-4">
            </img>
            <h2 className="text-2xl font-semibold text-gray-600">
              Oops! Looks like you have no items in your wishlist...
            </h2>
          </div>
        )}

        {/* {console.log(wishlist)} */}
      </div>
    </div>
  );
};

export default UserWishlist;
