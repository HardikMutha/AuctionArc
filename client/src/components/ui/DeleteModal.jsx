import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { IoMdAlert } from "react-icons/io";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import { Trash2 } from "lucide-react";
import Spinner from "../Spinner";

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

// eslint-disable-next-line react/prop-types
export default function CustomModal({ productid }) {
  const [open, setOpen] = useState(false);
  const { state } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDelete = async (productid) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/delete-product/${productid}`,
        null,
        { headers: { Authorization: `Bearer ${state?.token}` } }
      );
      setLoading(false);
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
        className="p-2 rounded-lg hover:bg-white text-red-500 transition-colors duration-200"
        onClick={handleOpen}
      >
        <Trash2 className="h-5 w-5" />
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
              {loading ? (
                <div className="mt-2">
                  <Spinner />
                </div>
              ) : null}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
