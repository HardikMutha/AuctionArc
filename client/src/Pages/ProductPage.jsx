/* eslint-disable no-unused-vars */
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Chip,
  Paper,
  Grid2,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GavelIcon from "@mui/icons-material/Gavel";
import TimerIcon from "@mui/icons-material/Timer";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import CssBaseline from "@mui/material/CssBaseline";
import PlaceBidPopup from "../components/PlaceBidPopup";
import useAuthContext from "../hooks/useAuthContext";

export default function ProductPage() {
  const { state, dispatch } = useAuthContext();
  const user = state.user;

  let userWishList = user?.wishList;
  console.log(userWishList);

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [bidPopup, setBidPopup] = useState(false);
  const theme = useTheme();
  const [currentPrice, setCurrentPrice] = useState(0.0);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  function getImageURL(url) {
    if (!url) return null;
    const tempURL = url.split("upload/");
    const newURL = tempURL[0].concat("upload/w_350,h_350/").concat(tempURL[1]);
    return newURL;
  }

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  function updateWishList() {
    userWishList?.includes(id) ? removeFromWishlist() : addToWishList();
  }

  async function addToWishList() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/wish-list/add-to-wishlist/${id}`,
        null,
        { withCredentials: true }
      );
      userWishList.push(id);
      dispatch({
        type: "UPDATE_WISHLIST",
        payload: userWishList,
      });
      // setaddtoWishlist(true);
    } catch (err) {
      console.log(err);
      if (err.status == 401) toast.warn("Please Login to use Wishlist");
      else toast.warn(err.response.data);
    }
  }

  async function removeFromWishlist() {
    const response = await axios.post(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/wish-list/remove-from-wishlist/${id}`,
      null,
      { withCredentials: true }
    );
    if (response.status == 200) {
      toast.success(response.data.msg);
      userWishList.splice(userWishList.indexOf(id), 1);
      dispatch({
        type: "UPDATE_WISHLIST",
        payload: userWishList,
      });
    } else {
      toast.error(response.data.msg);
    }
  }

  const renderBidPopup = () => {
    setBidPopup(true);
  };

  const fetchAllData = async () => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/product/products/${id}`
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        toast.error("Error Fetching Product");
        console.error("Error Fetching Product : ", error);
      }
    };

    const getSimilarProducts = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/product/get-similar-products/${id}`,
          { withCredentials: true }
        );
        setSimilarProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCurrentPrice = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/product/get-current-price/${id}`
      );
      setCurrentPrice(response.data.price);
    };
    await fetchProduct();
    await getSimilarProducts();
    await fetchCurrentPrice();
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  return (
    <div className="min-h-[100vh] bg-gradient-to-t from-[#f8f9fa] to-[#d9ecef]">
      <CssBaseline enableColorScheme />
      <Navbar />
      <PlaceBidPopup
        product={product}
        trigger={bidPopup}
        setBidPopup={setBidPopup}
      />
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 8, md: 12 },
          pb: 8,
          marginTop: 10,
        }}
      >
        <Grid2
          container
          spacing={{ xs: 2, md: 4 }}
          alignItems="center"
          justifyContent="center"
        >
          {/* Product Image */}
          {/* Product Image Carousel */}
          <Grid2 item="true" xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                aspectRatio: "1/1",
                width: "100%",
                maxWidth: { xs: "100%", md: 500 },
                mx: "auto",
                position: "relative",
              }}
            >
              <Box
                component="img"
                src={
                  product?.images?.[currentImageIndex]
                    ? `${getImageURL(product?.images?.[currentImageIndex])}`
                    : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                }
                alt="product"
                sx={{
                  width: { md: "450px", xs: "300px" },
                  height: { md: "450px", xs: "300px" },
                  objectFit: "cover",
                  transition: "all 0.3s ease-in-out",
                }}
              />
              {product?.images?.length > 1 && (
                <>
                  <IconButton
                    onClick={prevImage}
                    sx={{
                      position: "absolute",
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                  <IconButton
                    onClick={nextImage}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    {product.images.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor:
                            index === currentImageIndex
                              ? "primary.main"
                              : "rgba(255, 255, 255, 0.8)",
                          cursor: "pointer",
                        }}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Paper>
          </Grid2>

          {/* Product Details */}
          <Grid2 item="true" xs={12} md={6}>
            <Box
              sx={{
                borderRadius: 4,
                p: { xs: 3, md: 4 },
                height: "100%",
                maxWidth: { xs: "100%", md: 500 },
                mx: "auto",
              }}
            >
              <Stack spacing={3}>
                {/* Title */}
                <Typography variant={isMobile ? "h4" : "h3"} fontWeight="500">
                  {product?.name || "Product Name"}
                </Typography>

                {/* Tags */}
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                >
                  {/* {['Fashion', 'Formals', 'Electronics'].map((tag) => ( */}
                  <Chip
                    key={product?.category}
                    icon={<LocalOfferIcon />}
                    label={product?.category}
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  />
                  {/* ))} */}
                </Stack>

                {/* Price and Description */}
                <Box>
                  <Typography variant="body1" color="text.secondary">
                    {product?.description || "Product description"}
                  </Typography>
                  <Typography
                    variant={isMobile ? "h7" : "h8"}
                    fontWeight="500"
                    gutterBottom
                  >
                    Listing Price: ${product?.listingPrice || "0.00"}
                    <br />
                    Current Price: $
                    {product?.currentPrice || product?.listingPrice || "0.00"}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ width: "100%" }}
                >
                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    startIcon={<FavoriteBorderIcon />}
                    fullWidth
                    sx={{
                      borderRadius: 8,
                      bgcolor: "#E43A36",
                      "&:hover": {
                        bgcolor: "#D32F2F",
                        transform: "scale(1.02)",
                        transition: "all 0.3s",
                      },
                    }}
                    onClick={updateWishList} // Attach the click handler
                  >
                    {userWishList?.includes(id)
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                  </Button>
                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
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
                    onClick={renderBidPopup}
                  >
                    Place Bid!
                  </Button>
                </Stack>

                {/* Timer */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.secondary",
                  }}
                >
                  <TimerIcon />
                  <Typography>
                    Auction live till:{" "}
                    {product?.duration?.slice(0, 10) || "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid2>
        </Grid2>
      </Container>

      <Box
        sx={{
          p: "20px",
          display: "flex", // Use flexbox for centering
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          flexDirection: "column", // Stack items vertically
          gap: 8,
          mt: 2,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h6"}
          fontWeight="500"
          color="text.secondary"
          sx={{ px: "20px" }}
        >
          Products similar to &quot;{product?.name}&quot; ...
        </Typography>
        <hr
          style={{
            color: "black", // This will not affect the <hr> color
            height: "1px", // Increase the thickness
            backgroundColor: "gray", // Set the color of the <hr>
            border: "none", // Remove the default border
            width: "100%",
          }}
        ></hr>

        {/* Check if similarProducts is available */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            // {
            //   xs: "repeat(1, 1fr)", // 1 column for extra small screens
            //   sm: "repeat(2, 1fr)", // 2 columns for small screens
            //   md: "repeat(2, 1fr)", // 3 columns for medium screens
            //   lg: "repeat(2, 1fr)", // 3 columns for large screens
            // },
            gap: 8,
          }}
        >
          {similarProducts && similarProducts.length > 0 ? (
            similarProducts.map((similarProduct) => (
              <ProductCard
                key={similarProduct._id} // Ensure the key is set on ProductCard
                productDetails={similarProduct}
              />
            ))
          ) : (
            <Box
              key="no-product-found"
              sx={{ textAlign: "left", width: "100%" }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight="500"
                gutterBottom
              >
                No similar product found
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}
