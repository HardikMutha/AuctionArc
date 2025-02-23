/* eslint-disable react/prop-types */
import { Heart } from "lucide-react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";

const ProductCard = ({ productDetails }) => {
  const navigate = useNavigate();
  const [productSeller, setProductSeller] = useState("");

  let user = localStorage.getItem("user");
  user = user ? JSON.parse(user) : null;
  const userWishList = user?.wishList;
  const iscontainedInWishList = userWishList?.includes(productDetails._id);
  const [wishlist, setaddtoWishlist] = useState(iscontainedInWishList);
  const [currentPrice, setCurrentPrice] = useState(0);

  function getImageURL(url) {
    if (!url) return null;
    const tempURL = url.split("upload/");
    const newURL = tempURL[0].concat("upload/w_300,h_300/").concat(tempURL[1]);
    return newURL;
  }

  function updateWishList() {
    wishlist ? removeFromWishlist() : addToWishList();
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

  const fetchCurrentPrice = async () => {
    const response = await axios.get(
      `http://localhost:3000/get-current-price/${productDetails._id}`
    );
    console.log(response.data.price);
    setCurrentPrice(response.data.price);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user-details/${productDetails.productSeller}`
        );
        if (response.status == 200) {
          console.log(response.data.foundUser.username);
          setProductSeller(response.data.foundUser.username);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
    fetchCurrentPrice();
  }, []);

  return (
    <Card
      sx={{
        maxWidth: { lg: "70%", md: "100%", sm: "90%", xs: "90%" },
        mx: { xs: "auto" },
        my: 4,
        p: 2,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(200px)",
        boxShadow: "0 4px 10px rgba(0,0,0, 0.1)",
        ":hover": { boxShadow: "2px 6px 15px rgba(6,172,212, 0.4)" },
        border: "2px solid rgba(0, 217, 255, 0.4)",
        borderRadius: "15px",
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        {/* Product Image */}
        <Box
          sx={{
            position: "relative",
            flexShrink: 0,
            width: { xs: "100%", md: "25%" },
          }}
        >
          <img
            src={
              productDetails.images.length
                ? `${getImageURL(productDetails.images[0])}`
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
            }
            alt="Product"
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <IconButton
            color="secondary"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "white",
              boxShadow: 1,
            }}
            onClick={updateWishList}
          >
            <Heart color="purple" fill={wishlist ? "purple" : "white"} />
          </IconButton>
        </Box>
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="start"
          >
            <Box>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                fontWeight={600}
              >
                {productDetails.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="body"
                  color="textSecondary"
                  fontSize={{ md: "16px", sm: "20px", xs: "14px" }}
                >
                  About - {productDetails.description}
                </Typography>
              </Stack>
            </Box>
            <Box textAlign="right" display={{ md: "block", xs: "none" }}>
              <Typography variant="h6" fontWeight={400}>
                Current Price -{" "}
                <span className="text-green-600 font-semibold">
                  $ {currentPrice}
                </span>
              </Typography>
              <Typography variant="h6" fontWeight={400}>
                Listed At -{" "}
                <span className="text-red-600 font-semibold">
                  $ {productDetails.listingPrice}
                </span>
              </Typography>
            </Box>
          </Stack>

          {/* Actions */}
          <Box
            marginTop={{ xs: "70px", md: "auto" }}
            sx={{ display: "flex", justifyContent: "space-between" }}
            flexDirection={{ sm: "row", xs: "column" }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate(`/products/${productDetails._id}`)}
              sx={{
                bgcolor: "rgb(6 182 212)",
                ":hover": { bgcolor: "rgb(8 145 178)" },
              }}
            >
              View More
            </Button>
            <span className="mt-2 text-center">
              Listed By - {productSeller}
            </span>
          </Box>
        </CardContent>
      </Stack>
    </Card>
  );
};

export default ProductCard;
