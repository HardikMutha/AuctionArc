import { Star, Heart } from "lucide-react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Rating,
  Stack,
  IconButton,
} from "@mui/material";

const Temp = ({ productDetails }) => {
  function getImageURL(url) {
    if (!url) return null;
    const tempURL = url.split("upload/");
    const newURL = tempURL[0].concat("upload/w_300,h_300/").concat(tempURL[1]);
    return newURL;
  }
  return (
    <Card
      sx={{
        maxWidth: { lg: "1000px", md: "750px", sm: "450px", xs: "400px" },
        mx: { sm: "auto", xs: "10px" },
        my: 2,
        p: 2,
        boxShadow: 3,
        borderRadius: 3,
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
          >
            <Heart />
          </IconButton>
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="start"
          >
            <Box>
              <Typography variant="h6" component="h2" gutterBottom>
                {productDetails.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Rating value={4} precision={0.5} readOnly size="small" />
                <Typography variant="body2" color="textSecondary">
                  837 reviews
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • 1K+ bought in past month
                </Typography>
              </Stack>
            </Box>
            <Box textAlign="right">
              <Typography variant="h5" fontWeight={600}>
                $ {productDetails.listingPrice}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                (22 used & new offers)
              </Typography>
            </Box>
          </Stack>

          {/* Actions */}
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" size="large">
              See options
            </Button>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              No featured offers available
            </Typography>
          </Box>
        </CardContent>
      </Stack>
    </Card>
  );
};

export default Temp;
