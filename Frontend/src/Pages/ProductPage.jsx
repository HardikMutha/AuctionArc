import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GavelIcon from "@mui/icons-material/Gavel";
import TimerIcon from '@mui/icons-material/Timer';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';


export default function ProductPage() {
  const { id } = useParams();

  console.log(id);
  return (
    <>
      <Navbar />
      <Container sx={{ width: "80%", height: "200vh", mt: "25vh" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "coral",
              width: "450px",
              height: "450px",
              borderRadius: "20px",
            }}
          >
            <img
              alt="product"
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "20px",
                objectFit: "cover",
              }}
              src="https://cdn.mos.cms.futurecdn.net/39CUYMP8vJqHAYGVzUghBX.jpg"
            ></img>
          </div>
          <div
            style={{
              borderRadius: "20px",
              backgroundColor: "white",
              width: "50%",
              height: "450px",
              padding: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: "450" }}>
              Product Name
            </Typography>
            <div style = {{color : "gray", display : "flex", gap : "20px"}}>
              <div><LocalOfferIcon/> Fashion</div>
              <div><LocalOfferIcon/> Formals</div>
              <div><LocalOfferIcon/> Electronics</div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <Typography variant="h5" sx={{ fontWeight: "450" }}>
                {"$ " + 12.99}
              </Typography>
              <Typography>
                This is a sample product description that highlights the key
                features and benefits of the product. It is designed to provide
                value to customers.cription
              </Typography>
            </div>

            <div
              className="buttons"
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <button
                style={{
                  display: "flex",
                  width: "200px",
                  justifyContent: "space-evenly",
                  backgroundColor: "#E43A36",
                  padding: "10px",
                  borderRadius: "20px",
                  transition:
                    "background-color 0.3s, transform 0.3s, box-shadow 0.3s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#D32F2F";
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(0, 0, 0, 0.2)";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#E43A36";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.color = "#000000"; // or original text color
                }}
              >
                <FavoriteBorderIcon /> Add to Wishlist
              </button>

              <button
                style={{
                  display: "flex",
                  width: "200px",
                  justifyContent: "space-evenly",
                  backgroundColor: "#FFD700",
                  padding: "10px",
                  borderRadius: "20px",
                  transition:
                    "background-color 0.3s, transform 0.3s, box-shadow 0.3s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "black";
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(0, 0, 0, 0.2)";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFD700";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.color = "#000000"; // or original text color
                }}
              >
                <GavelIcon /> Place Bid!
              </button>
            </div>
            <div>
                <TimerIcon/> Auction live till : 12/12/1212
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
