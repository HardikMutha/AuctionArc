import React, { useState } from "react";
import { Slider, TextField, Box, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function PlaceBidPopup(props) {
  const [price, setPrice] = useState(parseInt(props.startingPrice) || 0);
  const maxPrice = props.startingPrice * 2;

  const handleSliderChange = (event, newValue) => {
    setPrice(newValue);
  };

  const handleInputChange = (event) => {
    setPrice(event.target.value === "" ? 0 : Number(event.target.value));
  };

  return props.trigger ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: "200000", // Higher than navbar
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "98%",
          height: "60%",
          borderRadius: "10px",
          padding: "20px",
          position: "absolute",
          display : "flex",
          flexDirection : 'column',
          alignItems : "center"
        }}
      >
        <button
          onClick={() => props.setBidPopup(false)}
          style={{
            position: "absolute", // Make it absolutely positioned
            top: "16px", // Position it at the top
            right: "16px", // Position it at the right
            background: "none", // Remove default styles
            border: "none", // Remove border
            fontSize: "16px", // Adjust font size
            cursor: "pointer", // Add pointer cursor
            color: "black", // Match text color
          }}
        >
          <CloseIcon/>
        </button>

        <Typography
          sx={{ mt : 4, display: "flex", justifyContent: "center", fontWeight: "500" }}
          variant="h4"
          gutterBottom
        >
          Place a Bid
        </Typography>
        <form>
          <Box sx={{ width: 300, margin: "auto"}}>
            <Typography
              id="price-slider"
              sx={{ fontWeight: "500" }}
              variant="h6"
              gutterBottom
            >
              Price
            </Typography>
            <Slider
              value={typeof price === "number" ? price : 0}
              onChange={handleSliderChange}
              aria-labelledby="price-slider"
              min={props.startingPrice}
              max={maxPrice}
              step={10}
              sx = {{width : "100%"}}
            />
            <TextField
              label="Exact Price"
              type="number"
              value={price}
              onChange={handleInputChange}
              inputProps={{
                min: props.startingPrice,
                max: maxPrice,
                step: 10,
              }}
              sx = {{width : "100%"}}
            />
          </Box>
        </form>

        <button>Place Bid!</button>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
}

export default PlaceBidPopup;
