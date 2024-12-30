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
  useMediaQuery 
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GavelIcon from "@mui/icons-material/Gavel";
import TimerIcon from "@mui/icons-material/Timer";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { format } from 'date-fns';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error Fetching Product : ", error);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <>
      <Navbar />
      <Container 
        maxWidth="lg" 
        sx={{ 
          pt: { xs: 8, md: 12 },
          pb: 8,
          marginTop : 10
        }}
      >
        <Grid2 
          container 
          spacing={{ xs: 2, md: 4 }} 
          alignItems="center"
          justifyContent="center"
        >
          {/* Product Image */}
          <Grid2 item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                aspectRatio: '1/1',
                width: '100%',
                maxWidth: { xs: '100%', md: 500 },
                mx: 'auto'
              }}
            >
              <Box
                component="img"
                src= {product?.images[0] || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"}
                alt="product"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Paper>
          </Grid2>

          {/* Product Details */}
          <Grid2 item xs={12} md={6}>
            <Box
              sx={{
                borderRadius: 4,
                p: { xs: 3, md: 4 },
                height: '100%',
                maxWidth: { xs: '100%', md: 500 },
                mx: 'auto'
              }}
            >
              <Stack spacing={3}>
                {/* Title */}
                <Typography 
                  variant={isMobile ? "h4" : "h3"} 
                  fontWeight="500"
                >
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
                  <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    fontWeight="500" 
                    gutterBottom
                  >
                    ${product?.listingPrice || "0.00"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {product?.description || "Product description"}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  sx={{ width: '100%' }}
                >
                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    startIcon={<FavoriteBorderIcon />}
                    fullWidth
                    sx={{
                      borderRadius: 8,
                      bgcolor: '#E43A36',
                      '&:hover': {
                        bgcolor: '#D32F2F',
                        transform: 'scale(1.02)',
                        transition: 'all 0.3s'
                      }
                    }}
                  >
                    Add to Wishlist
                  </Button>
                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    startIcon={<GavelIcon />}
                    fullWidth
                    sx={{
                      borderRadius: 8,
                      bgcolor: '#FFD700',
                      color: 'black',
                      '&:hover': {
                        bgcolor: 'black',
                        color: 'white',
                        transform: 'scale(1.02)',
                        transition: 'all 0.3s'
                      }
                    }}
                  >
                    Place Bid!
                  </Button>
                </Stack>

                {/* Timer */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: 'text.secondary'
                  }}
                >
                  <TimerIcon />
                  <Typography>
                    Auction live till:  {product?.duration.slice(0, 10)|| "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </>
  );
}