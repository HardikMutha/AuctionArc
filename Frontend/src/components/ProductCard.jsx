/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"; // Import Link from React Router
import { Container, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ProductCard({ productDetails }) {
  let user = localStorage.getItem("user");
  user = user ? JSON.parse(user) : null;
  const userWishList = user?.wishList;
  const iscontainedInWishList = userWishList?.includes(productDetails._id);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlist, setaddtoWishlist] = useState(iscontainedInWishList);

  function updateWishList() {
    wishlist ? removeFromWishlist() : addToWishList();
  }
  function getImageURL(url) {
    if (!url) return null;
    const tempURL = url.split("upload/");
    const newURL = tempURL[0].concat("upload/w_300,h_300/").concat(tempURL[1]);
    // console.log(newURL);
    return newURL;
  }

  async function addToWishList() {
    try {
      const response = await axios.post(
        `http://localhost:3000/wish-list/add-to-wishlist/${productDetails._id}`,
        null,
        { withCredentials: true }
      );
      toast.success(response.data.msg);
      setaddtoWishlist(true);
    } catch (err) {
      console.log(err);
      if (err.status == 401) toast.warn("Please Login to use Wishlist");
      else toast.warn(err.response.data);
    }
  }
  async function removeFromWishlist() {
    console.log("removed");
    const response = await axios.post(
      `http://localhost:3000/wish-list/remove-from-wishlist/${productDetails._id}`,
      null,
      { withCredentials: true }
    );
    if (response.status == 200) {
      toast.success(response.data.msg);
      setaddtoWishlist(false);
    } else {
      toast.error(response.data.msg);
    }
  }

  return (
    <div>
      <FavoriteIcon
        sx={{
          position: "relative",
          top: "30px",
          left: "90%",
          color: wishlist ? "red" : "white",
          backgroundColor: "transparent",
          transition: "all 0.3s ease",
          scale: isHovered ? "1.05" : "1.00",
          transform: isHovered ? "rotate(-10deg)" : "rotate(0deg)", // Rotate on hover
          zIndex: "100",
        }}
        onClick={updateWishList}
      />
      <Link to={`/products/${productDetails._id}`}>
        <div
          style={{
            borderRadius: "20px",
            width: window.innerWidth >= 400 ? "350px" : "320px",
            height: "400px",
            border: "1px solid #ccc",
            boxShadow: "10px 10px 5px #ccc",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // Ensures the content respects the rounded corners
            transition: "all 0.3s ease",
            backgroundColor: isHovered ? "#f0f0f0" : "white", // Change background color on hover
            transform: isHovered ? "scale(1.02)" : "scale(1)",
            zIndex: "-1",
          }}
          onMouseEnter={() => setIsHovered(true)} // Set hover state to true
          onMouseLeave={() => setIsHovered(false)} // Set hover state to false
          key={productDetails._id}
        >
          <div
            style={{
              width: "100%",
              height: "80%",
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderBottomLeftRadius: "20px",
                borderBottomRightRadius: "20px", // Ensure image respects rounded corners
              }}
              src={
                // productDetails.images[0] ||
                // "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
                productDetails.images.length
                  ? `${getImageURL(productDetails.images[0])}`
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
              }
              alt="Product"
            />
          </div>
          {/* <Link to={`/products/${productDetails._id}`}> */}
          <Container sx={{ padding: 2 }}>
            <Typography variant="h5" sx={{ color: "black" }}>
              {productDetails.name}
            </Typography>
            <Typography variant="h6" sx={{ color: "gray" }}>
              {"$ " + productDetails.listingPrice}
            </Typography>
          </Container>
          {/* </Link> */}
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
