import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { IoMdAlert } from "react-icons/io";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";
import useAuthContext from "../../hooks/useAuthContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  backgroundColor: "black",
  color: "white  ",
  p: 4,
};

export default function LogoutModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const handleLogout = async () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <div className="inline">
      <button onClick={handleOpen} className="w-[100%] text-center">
        Logout
      </button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="w-[90%] mx-auto">
              <IoMdAlert
                color="yellow"
                size={"3em"}
                style={{ width: "fit-content", margin: "auto" }}
              />
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                sx={{ textAlign: "center" }}
              >
                Are you sure you want to Logout?
              </Typography>
              <Typography
                id="transition-modal-description"
                sx={{
                  margin: "auto",
                  mt: 2,
                  textAlign: "center",
                  width: "85%",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <button
                  className="bg-[#FFFF00] hover:bg-yellow-400 p-2 border-2 border-yellow-400 rounded-md font-[500] text-black"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Yes I&apos;m sure
                </button>
                <button
                  className="border-2 p-2 rounded-md border-gray-500 font-[500] hover:bg-gray-300"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  No, cancel
                </button>
              </Typography>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
