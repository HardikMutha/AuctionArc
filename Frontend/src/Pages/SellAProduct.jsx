import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import axios from "axios";
import LoginContext from "../contexts/LoginContext";
import Spinner from "../components/Spinner";

// Important Note -  The problem of dealing with mutiple files is likely due to usage of MUI form.
// The backend code is fine and frontend needs modification.
// One of the possible solutions is switching to standard form and then manually implementing validation
// As of now only single files are being handled

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100vw",
  height: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "600px",
  },
}));

const SellProductContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: "rgba(249,136,102,0.7)",
  backgroundRepeat: "no-repeat",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
  },
}));

export default function SellAProduct() {
  // State management for Form Validation
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");

  const [descriptionError, setDescriptionError] = React.useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] =
    React.useState("");

  const [imagesError, setImagesError] = React.useState(false);
  const [imagesErrorMessage, setImagesErrorMessage] = React.useState("");

  const [categoryError, setCategoryError] = React.useState(false);
  const [categoryErrorMessage, setCategoryErrorMessage] = React.useState("");

  const [ListingError, setListingError] = React.useState(false);
  const [ListingErrorMessage, setListingErrorMessage] = React.useState("");

  const [durationError, setDurationError] = React.useState(false);
  const [durationErrorMessage, setDurationErrorMessage] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  //State management for image uploads
  const [files, setFiles] = React.useState([]);

  const navigate = useNavigate();
  const login = React.useContext(LoginContext);

  const validateInputs = () => {
    const name = document.getElementById("name");
    const description = document.getElementById("description");
    const images = document.getElementById("images");
    const category = document.getElementById("category");
    const listingPrice = document.getElementById("listingPrice");
    const duration = document.getElementById("duration");

    let isValid = true;

    if (!name.value) {
      setNameError(true);
      setNameErrorMessage("Please enter a valid Product Name.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!description.value) {
      setDescriptionError(true);
      setDescriptionErrorMessage(
        "Please Provide a short description about your product"
      );
      isValid = false;
    } else {
      setDescriptionError(false);
      setDescriptionErrorMessage("");
    }

    if (!images.value) {
      setImagesError(true);
      setImagesErrorMessage("Please upload atleast 1 Image.");
      isValid = false;
    } else {
      setImagesError(false);
      setImagesErrorMessage("");
    }

    if (!category.value) {
      setCategoryError(true);
      setCategoryErrorMessage("Category required.");
      isValid = false;
    } else {
      setCategoryError(false);
      setCategoryErrorMessage("");
    }
    if (!listingPrice.value) {
      setListingError(true);
      setListingErrorMessage("Listing Price is required.");
      isValid = false;
    } else {
      setListingError(false);
      setListingErrorMessage("");
    }
    if (!duration.value) {
      setDurationError(true);
      setDurationErrorMessage("Please Provide a duration for auction");
      isValid = false;
    } else {
      setDurationError(false);
      setDurationErrorMessage("");
    }
    return isValid;
  };

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await axios.post(
        "http://localhost:3000/add-newproduct",
        data,
        {
          withCredentials: true,
        },
        {headers: { "Content-Type": "multipart/form-data" },}
      );
      setLoading(false);
      toast.success(response.data.msg);
      setTimeout(() => {}, 1000);
      navigate(`/products/${response.data.id}`);
    } catch (err) {
      console.log(err);
      console.log(err.response);
      if (err.response?.status == 409) {
        toast.error(err.response.data.message);
      } else toast.error("An Error Occured Please try again");
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <CssBaseline enableColorScheme />

      <SellProductContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
            className="text-center"
          >
            <p className="font-semibold">Start New Auction</p>
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            encType="multipart/form-data"
          >
            <FormControl>
              <FormLabel htmlFor="name">Name of Product</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Watch ... "
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="description">Description</FormLabel>
              <TextField
                autoComplete="description"
                type="text area"
                name="description"
                fullWidth
                id="description"
                placeholder="Describe your product here..."
                error={descriptionError}
                helperText={descriptionErrorMessage}
                color={descriptionError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="images">Images</FormLabel>
              <input
                required
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                className="block w-[100%] mt-[10px] p-3 border-2 border-[#aaa] rounded-md border-solid"
                onChange={handleFileChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="category">Category</FormLabel>
              <TextField
                required
                fullWidth
                name="category"
                placeholder="Category"
                id="category"
                autoComplete="product-category"
                variant="outlined"
                error={categoryError}
                helperText={categoryErrorMessage}
                color={categoryError ? "error" : "primary"}
              />
            </FormControl>

            <Stack
              direction="row"
              spacing={2}
              sx={{ marginTop: 2, alignItems: "center" }}
            >
              <FormControl sx={{ flex: 1 }}>
                <FormLabel htmlFor="listingPrice">Listing Price</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="listingPrice"
                  type="float"
                  step="0.01"
                  placeholder="Listing Price"
                  id="listingPrice"
                  autoComplete="product-category"
                  variant="outlined"
                  error={ListingError}
                  helperText={ListingErrorMessage}
                  color={ListingError ? "error" : "primary"}
                />
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <FormLabel htmlFor="duration">Auction Duration</FormLabel>
                <TextField
                  required
                  fullWidth
                  type="date"
                  name="duration"
                  step="0.01"
                  placeholder="Duration of Auction"
                  id="duration"
                  autoComplete="duration"
                  variant="outlined"
                  error={durationError}
                  helperText={durationErrorMessage}
                  color={durationError ? "error" : "primary"}
                />
              </FormControl>
            </Stack>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              style={{ marginTop: "25px" }}
            >
              Start Auction!
            </Button>
          </Box>
          {loading ? <Spinner /> : null}
        </Card>
      </SellProductContainer>
    </>
  );
}
