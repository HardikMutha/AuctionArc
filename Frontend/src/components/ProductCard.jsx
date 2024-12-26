import { Container, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";

function ProductCard(productDetails) {
    console.log(productDetails.productDetails)
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                borderRadius: "20px",
                width: "350px",
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
        >
            <div style={{ position: "relative" }}>
                <img
                    style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "auto",
                        borderBottomLeftRadius: "20px",
                        borderBottomRightRadius: "20px", // Ensure image respects rounded corners
                    }}
                    src="https://neemans.com/cdn/shop/files/ND-EBSneaker-PebbleGrey-_WebOptimized_a_1600x.jpg?v=1724987944"
                    alt="Product"
                />

                <FavoriteIcon
                    sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        color: "red",
                        transition: "all 0.3s ease",
                        scale: isHovered ? "1.05" : "1.00",
                        transform: isHovered ? "rotate(-10deg)" : "rotate(0deg)", // Rotate on hover
                    }}
                />
            </div>

            <Container sx={{ padding: 2 }}>
                <Typography variant="h5" sx={{ color: "black" }}>
                    {productDetails.productDetails.name}
                </Typography>
                <Typography variant="h6" sx={{ color: "gray" }}>
                    {"$ " + productDetails.productDetails.listingPrice}
                </Typography>
            </Container>
        </div>
    );
}

export default ProductCard;
