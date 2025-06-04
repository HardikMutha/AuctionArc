/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import useAuthContext from "../hooks/useAuthContext";
import Navbar from "../components/Navbar";

const UserWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { state, dispatch } = useAuthContext();
  const data = state.user;
  useEffect(() => {
    async function getWishlist() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/wish-list`,
          { headers: { Authorization: `Bearer ${state?.token}` } }
        );

        if (response.status === 200) {
          const wishlistIds = response.data.wishList;

          const productPromises = wishlistIds.map((id) =>
            axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/product/products/${id}`,
              { headers: { Authorization: `Bearer ${state?.token}` } }
            )
          );
          const productResponses = await Promise.all(productPromises);
          const products = productResponses.map((res) => res.data);
          setWishlist(products);
        }
      } catch (err) {
        console.log(err);
      }
    }
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
              className="w-40 h-40 mb-4"
            ></img>
            <h2 className="text-2xl font-semibold text-gray-600">
              Oops! Looks like you have no items in your wishlist...
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserWishlist;
