/* eslint-disable react/prop-types */
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";

// Terrible logic to sync the wishlist products imo but hey it works ig ¯\_(ツ)_/¯
// keeps track of the list in the frontend and updates it when the user clicks the heart icon / red add/remove button

const ProductCard = ({ productDetails }) => {
  const navigate = useNavigate();
  const [productSeller, setProductSeller] = useState("");
  const { state, dispatch } = useAuthContext();
  const user = state.user;

  let userWishList = user?.wishList;
  const [currentPrice, setCurrentPrice] = useState(0);

  function getImageURL(url) {
    if (!url) return null;
    const tempURL = url.split("upload/");
    const newURL = tempURL[0].concat("upload/w_300,h_300/").concat(tempURL[1]);
    return newURL;
  }

  function updateWishList(e) {
    e.stopPropagation();
    userWishList?.includes(productDetails?._id)
      ? removeFromWishlist()
      : addToWishList();
  }

  async function addToWishList() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/wish-list/add-to-wishlist/${
          productDetails?._id
        }`,
        null,
        { headers: { Authorization: `Bearer ${state?.token}` } }
      );
      toast.success(response.data.msg);
      userWishList.push(productDetails?._id);
      dispatch({
        type: "UPDATE_WISHLIST",
        payload: userWishList,
      });
    } catch (err) {
      console.log(err);
      if (err.status == 401) toast.warn("Please Login to use Wishlist");
      else toast.warn(err.response);
    }
  }

  async function removeFromWishlist() {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/wish-list/remove-from-wishlist/${
        productDetails._id
      }`,
      null,
      { headers: { Authorization: `Bearer ${state?.token}` } }
    );
    if (response.status == 200) {
      toast.success(response.data.msg);
      userWishList.splice(userWishList.indexOf(productDetails?._id), 1);
      dispatch({
        type: "UPDATE_WISHLIST",
        payload: userWishList,
      });
    } else {
      toast.error(response.data.msg);
    }
  }

  const fetchCurrentPrice = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/product/get-current-price/${
        productDetails._id
      }`
    );
    setCurrentPrice(response?.data?.price);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/user-details/${
            productDetails?.productSeller
          }`
        );
        if (response.status == 200) {
          setProductSeller(response?.data?.foundUser?.username);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
    fetchCurrentPrice();
  }, []);

  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate(`/products/${productDetails?._id}`)}
    >
      <div className="max-w-5xl w-[96%] mx-auto my-16 p-8 bg-white/60 backdrop-blur-xl shadow-md hover:shadow-cyan-400/40 border-2 border-cyan-400/40 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="relative flex-shrink-0">
            <img
              src={
                productDetails?.images.length
                  ? `${getImageURL(productDetails?.images[0])}`
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
              }
              alt="Product"
              className="w-full rounded-lg"
            />
            <button
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
              onClick={updateWishList}
            >
              <Heart
                color="purple"
                fill={
                  userWishList?.includes(productDetails?._id)
                    ? "purple"
                    : "white"
                }
              />
            </button>
          </div>

          <div className="flex-grow flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex flex-col justify-start">
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  {productDetails?.name}
                </h2>
              </div>

              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mr-1"
                  fill="gray"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <div className="text-center">
                  <span className="text-red-500 font-bold block text-xl">
                    ${currentPrice}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-gray-600 text-sm md:text-base sm:text-lg w-4/5 w-full">
                {productDetails?.description.length > 120
                  ? `${productDetails?.description.substring(0, 120)}...`
                  : productDetails?.description}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-16 md:mt-auto flex flex-col sm:flex-row justify-between">
              <button
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md"
                onClick={() => navigate(`/products/${productDetails._id}`)}
              >
                View More
              </button>
              <span className="mt-2 text-center">
                Listed By - {productSeller}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
