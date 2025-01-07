import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { IoMdAlert } from "react-icons/io";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { toast } from "react-toastify";

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
  p: 4,
};

export default function CustomModal({ productid }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDelete = async (productid) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/delete-product/${productid}`,
        null,
        { withCredentials: true }
      );
      if (response.status == 200) {
        toast.success(response.data.message);
        location.reload();
      }
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  };

  return (
    <div className="inline">
      <button
        onClick={handleOpen}
        className="mx-1 border-2 p-2 rounded-lg border-[#f70202] bg-[#f70202] font-semibold transition ease-out  hover:-translate-y-1 inline"
      >
        Delete
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
                color="red"
                size={"3em"}
                style={{ width: "fit-content", margin: "auto" }}
              />
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                sx={{ textAlign: "center" }}
              >
                Are you sure you want to delete this product?
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
                  className="bg-[#FF000F] hover:bg-red-600 p-2 border-2 border-red-700 rounded-md font-[500]"
                  onClick={() => {
                    handleDelete(productid);
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
