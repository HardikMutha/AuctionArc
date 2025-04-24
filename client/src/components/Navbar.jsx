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
  Dashboard as DashboardIcon,
  AccessTime as AccessIcon,
} from "@mui/icons-material";
import { CiHeart } from "react-icons/ci";
import { useContext } from "react";
import NavbarMenu from "./ui/NavbarMenu";
import LoginContext from "../contexts/LoginContext";
import LogoutModal from "./LogoutModal";

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
// const Navbar = ({ setsearchQuery, showSearch }) => {
const Navbar = (props) => {
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
      text: "Past Auctions",
      icon: <AccessIcon color="rgb(212 212 216)" size={"1.3em"} />,
      link: "/temp",
    },

    {
      text: "Sell a Product",
      icon: <ProductIcon sx={{ color: "rgb(212 212 216)" }} />,
      link: "/sell-new-product",
    },
    {
      text: "Wishlist",
      icon: <CiHeart color="rgb(212 212 216)" size={"1.3em"} />,
      link: "/wishlist",
    },
  ];
  const menuItems2 = [
    {
      text: "Past Auctions",
      icon: <AccessIcon color="rgb(212 212 216)" size={"1.3em"} />,
      link: "/temp",
    },
    {
      text: "Sell a Product",
      icon: <ProductIcon sx={{ color: "black" }} />,
      link: "/sell-new-product",
    },
    {
      text: "Wishlist",
      icon: <CiHeart color="black" size={"1.3em"} />,
      link: "/wishlist",
    },
  ];

  const profileItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon color="black" size={"1.3rem"} />,
      link: "/dashboard",
    },
  ];

  const profileOptions = (
    <Box>
      <List>
        {profileItems.map((item) => (
          <Link key={item.text} to={item.link}>
            <ListItem button key={item.text}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  const login = (
    <Link to={"/login"}>
      <Button
        sx={{
          color: "rgb(212 212 216)",
          ml: 2,
        }}
      >
        Login <br />
      </Button>
    </Link>
  );

  const drawer = (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      role="presentation"
    >
      <List>
        {menuItems2.map((item) => (
          <Link to={item.link} key={item.text}>
            <ListItem button key={item.text}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
        {loginContext.isLoggedIn ? profileOptions : login}
      </List>
      <List sx={{ marginBottom: "10px" }}>
        <LogoutModal />
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ bgcolor: "rgb(24 24 27)", maxHeight: "60px" }}
      >
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
            <Link to={"/"} className="text-blue-300">
              AUCTION ARC
            </Link>
          </Typography>
          {props.showSearch === undefined && (
            <Search
              sx={{
                borderRadius: "20px",
                color: "#D7431D",
              }}
            >
              <SearchIconWrapper>
                <SearchIcon sx={{ color: "lightblue" }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  props.setsearchQuery(e.target.value);
                }}
                sx={{ color: " rgb(228 228 231)" }}
              />
            </Search>
          )}
          <Box sx={{ flexGrow: 1 }} />

          {!isMobile && loginContext.isLoggedIn ? (
            <Box sx={{ display: "flex", gap: 2, color: "white" }}>
              {menuItems.map((item) => (
                <Link key={item.text} to={item.link}>
                  <Button color="inherit" startIcon={item.icon}>
                    <span className="mt-1">{item.text}</span>
                  </Button>
                </Link>
              ))}
            </Box>
          ) : null}

          {loginContext.isLoggedIn ? <NavbarMenu /> : login}
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
