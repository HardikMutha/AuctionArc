/* eslint-disable react/prop-types */
import { Container, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

function ProductCard({ productDetails }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const userWishList = user.wishList;
  const iscontainedInWishList = userWishList.includes(productDetails._id);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlist, setaddtoWishlist] = useState(iscontainedInWishList);

  function updateWishList() {
    wishlist ? removeFromWishlist() : addToWishList();
  }

  async function addToWishList() {
    console.log("added");
    const response = await axios.post(
      `http://localhost:3000/wish-list/add-to-wishlist/${productDetails._id}`,
      null,
      { withCredentials: true }
    );
    if (response.status == 200) {
      toast.success(response.data.msg);
      setaddtoWishlist(true);
    } else {
      toast.error(response.data.msg);
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
      }}
      onMouseEnter={() => setIsHovered(true)} // Set hover state to true
      onMouseLeave={() => setIsHovered(false)} // Set hover state to false
      key={productDetails._id}
    >
      <FavoriteIcon
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: wishlist ? "red" : "white",
          backgroundColor: "black",
          transition: "all 0.3s ease",
          scale: isHovered ? "1.05" : "1.00",
          transform: isHovered ? "rotate(-10deg)" : "rotate(0deg)", // Rotate on hover
          zIndex: "100",
        }}
        onClick={updateWishList}
      />
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
            productDetails.images[0] ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
          }
          alt="Product"
        />
      </div>
      <Link to={`/products/${productDetails._id}`}>
        <Container sx={{ padding: 2 }}>
          <Typography variant="h5" sx={{ color: "black" }}>
            {productDetails.name}
          </Typography>
          <Typography variant="h6" sx={{ color: "gray" }}>
            {"$ " + productDetails.listingPrice}
          </Typography>
        </Container>
      </Link>
    </div>
  );
}

export default ProductCard;
