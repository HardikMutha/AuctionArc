import { useState } from "react";
import { Link } from "react-router";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  alpha,
  styled,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ShoppingBag as ProductIcon,
} from "@mui/icons-material";
import { CiHeart } from "react-icons/ci";
import { useContext } from "react";
import BasicMenu from "./ui/BasicMenu";
import LoginContext from "../contexts/LoginContext";

// Styled search component
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.2),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "40ch",
    },
  },
}));

// eslint-disable-next-line react/prop-types
const Navbar = ({ setsearchQuery }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const theme = useTheme();
  const loginContext = useContext(LoginContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    {
      text: "Sell a Product",
      icon: <ProductIcon sx={{ color: "#D7431D" }} />,
      link: "/sell-new-product",
    },
    {
      text: "Wishlist",
      icon: <CiHeart color="red" size={"1.3em"} />,
      link: "/wishlist",
    },
  ];

  const login = (
    <Link to={"/login"}>
      <Button
        sx={{
          color: "black",
          ml: 2,
        }}
      >
        Login <br />
      </Button>
    </Link>
  );

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      {loginContext.isLoggedIn ? <BasicMenu nice={"true"} /> : login}
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "#FCFAF9", maxHeight: "60px" }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon sx={{ color: "#D7431D" }} />
            </IconButton>
          )}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" }, color: "#D7431D" }}
          >
            <Link to={"/"}>AUCTION ARC</Link>
          </Typography>
          <Search
            sx={{
              borderRadius: "20px",
              color: "#D7431D",
              // boxShadow:
              // "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;",
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setsearchQuery(e.target.value);
              }}
              sx={{ color: "black" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />

          {!isMobile && loginContext.isLoggedIn ? (
            <Box sx={{ display: "flex", gap: 2, color: "black" }}>
              {menuItems.map((item) => (
                <Link key={item.text} to={item.link}>
                  <Button color="inherit" startIcon={item.icon}>
                    <span className="mt-1">{item.text}</span>
                  </Button>
                </Link>
              ))}
            </Box>
          ) : null}

          {loginContext.isLoggedIn ? <BasicMenu /> : login}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Navbar;
