import React, { useState } from "react";
import { Slider, TextField, Box, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GavelIcon from "@mui/icons-material/Gavel";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function PlaceBidPopup(props) {
  const product = props.product;

  // Ensure product exists, and provide default values if not
  const listingPrice = product?.listingPrice ? parseInt(product.listingPrice) : 0;
  const [price, setPrice] = useState(listingPrice);
  const maxPrice = listingPrice * 2;

  const handleSliderChange = (event, newValue) => {
    setPrice(newValue);
  };

  const handleInputChange = (event) => {
    const inputValue = Number(event.target.value);
    if (inputValue >= listingPrice && inputValue <= maxPrice) {
      setPrice(inputValue);
    }
  };

  const handleBidRequest = async (event) => {
    event.preventDefault(); // Prevent the default form submission
  
    if (!product) {
      toast.error("Product details are missing.");
      return;
    }
  
    try {
      // Make the POST request to the backend
      console.log(product._id)
      const response = await axios.post(
        `http://localhost:3000/place-bid/${product._id}`, // Use the product ID in the URL
        { bidAmount: price }, // Pass the bid amount in the request body
        { withCredentials: true } // Include credentials if needed for authentication
      );
  
      if (response.status === 200) {
        toast.success("Bid Placed Successfully");
        props.setBidPopup(false); // Close the popup on success
      } else {
        toast.error("Failed to place bid. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Show specific error message from the server
      } else {
        toast.error("Error placing bid. Please check your network and try again.");
      }
      console.error("Error placing bid:", error);
    }
  };
  

  if (!product) {
    return null; // Don't render the component if the product prop is missing
  }

  return props.trigger ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 2000,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          width: { md: "60%", xs: "98%" },
          height: "60%",
          borderRadius: "10px",
          padding: "20px",
          position: "absolute",
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => props.setBidPopup(false)}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            color: "black",
          }}
        >
          <CloseIcon />
        </button>

        <Typography
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            fontWeight: "500",
          }}
          variant="h4"
          gutterBottom
        >
          Place a Bid
        </Typography>

        <Box sx={{ width: 300, margin: "auto", height: "50%" }}>
          <Typography
            id="price-slider"
            sx={{ fontWeight: "500" }}
            variant="h6"
            gutterBottom
          >
            Listing Price: $ {listingPrice}
          </Typography>
          <Slider
            value={typeof price === "number" ? price : 0}
            onChange={handleSliderChange}
            aria-labelledby="price-slider"
            min={listingPrice}
            max={maxPrice}
            step={10}
            sx={{
              width: "100%",
              "& .MuiSlider-thumb": {
                backgroundColor: "primary.main",
              },
              "& .MuiSlider-track": {
                height: 10,
                background: "linear-gradient(90deg, indigo, purple)",
              },
              mb: "15%",
            }}
          />
          <TextField
            label="Exact Price"
            type="number"
            value={price}
            onChange={handleInputChange}
            InputProps={{
              inputProps: {
                min: listingPrice,
                max: maxPrice,
                step: 10,
              },
            }}
            sx={{ width: "100%" }}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<GavelIcon />}
          fullWidth
          sx={{
            borderRadius: 8,
            bgcolor: "#FFD700",
            color: "black",
            "&:hover": {
              bgcolor: "black",
              color: "white",
              transform: "scale(1.02)",
              transition: "all 0.3s",
            },
          }}
          onClick={handleBidRequest}
        >
          Place Bid!
        </Button>
        {props.children}
      </Box>
    </div>
  ) : null;
}

export default PlaceBidPopup;
