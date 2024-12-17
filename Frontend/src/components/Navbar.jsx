import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SearchBar from "./SearchBar";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';


function DrawerAppBar(props) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar
          sx={{
            backgroundColor: "white",
            color: "black",
            display: "flex",
            justifyContent: "space-between",
            py : "15px"
          }}
        >

          <Box sx={{ width : "100%", display: "flex", alignItems: "center" }}>

            <Typography
              variant="h6"
              component="div"
              sx={{
                color: "#FF5A5F",
                mr: 5, // Add margin between title and SearchBar
                textAlign : "center"
              }}
            >
              AUCTION ARC
            </Typography>
            {/* Search Bar component */}
            <SearchBar />
          </Box>

          {/* Right Section: Buttons */}
          <Box
            sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}
          >
              <Button
                sx={{
                  color: "black",
                  ml: 2, // Add margin between buttons
                }}
              >
                Sell a product
              </Button>
              <Button
                sx={{
                  color: "black",
                  ml: 2, // Add margin between buttons
                }}
              >
                <AccountCircleRoundedIcon fontSize = "large"/>
              </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
