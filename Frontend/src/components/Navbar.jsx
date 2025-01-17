import { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SearchBar from "./SearchBar";
import { Link } from "react-router";
import BasicMenu from "./ui/BasicMenu";
import { CiHeart } from "react-icons/ci";
import LoginContext from "../contexts/LoginContext";

// eslint-disable-next-line react/prop-types
function Navbar({ searchQuery, setsearchQuery }) {
  const login = useContext(LoginContext);
  return (
    <div className="z-[1000] fixed">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar
            sx={{
              backgroundColor: "white",
              color: "black",
              display: "flex",
              justifyContent: "space-between",
              py: "15px",
            }}
          >
            <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
              <Link to={"/"}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    color: "#FF5A5F",
                    mr: 5, // Add margin between title and SearchBar
                    textAlign: "center",
                  }}
                >
                  AUCTION ARC
                </Typography>
              </Link>
              {/* Search Bar component */}
              <SearchBar
                searchQuery={searchQuery}
                setsearchQuery={setsearchQuery}
              />
            </Box>

            {/* Right Section: Buttons */}
            {login.isLoggedIn ? (
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                }}
              >
                <Link to={"/wishlist"}>
                  <Button
                    sx={{
                      color: "black",
                      ml: 2, // Add margin between buttons
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CiHeart size={"1.5em"} />
                    WishList
                  </Button>
                </Link>
              </Box>
            ) : null}
            {login.isLoggedIn ? (
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                }}
              >
                <Link to={"/sell-new-product"}>
                  <Button
                    sx={{
                      color: "black",
                      ml: 2, // Add margin between buttons
                    }}
                  >
                    Sell a product
                  </Button>
                </Link>
                <BasicMenu />
              </Box>
            ) : (
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                }}
              >
                <Link to={"/login"}>
                  <Button
                    sx={{
                      color: "black",
                      ml: 2, // Add margin between buttons
                    }}
                  >
                    Login <br />
                  </Button>
                </Link>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

export default Navbar;
