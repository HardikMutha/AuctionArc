import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Link } from "react-router-dom";
import LogoutModal from "../LogoutModal";
import { MdAccountCircle } from "react-icons/md";

export default function BasicMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ marginLeft: "7px", textTransform: "none" }}
      >
        <MdAccountCircle
          size={"2em"}
          color={props.nice === "true" ? "gray" : "white"}
        />
        <span
          className={
            props.nice === "true"
              ? "text-gray-600 ml-7 text-lg"
              : "text-white ml-2 "
          }
        >
          Profile
        </span>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Link to={"/dashboard"}>
          <MenuItem>Dashboard</MenuItem>
        </Link>

        <LogoutModal />
      </Menu>
    </div>
  );
}
