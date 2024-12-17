import { useContext, useEffect } from "react";
import LoginContext from "../contexts/LoginContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Homepage = () => {
  const login = useContext(LoginContext);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(
          `http://localhost:3000/auth/authenticate-user`,
          {},
          { withCredentials: true }
        );
        if (response.status == 200) {
          login.setisLoggedIn(true);
          // console.log(response.data);
          localStorage.setItem("user", response.data);
        }
      } catch (err) {
        console.log(err);
        toast.error("An Error Occured, Please Login Again");
      }
    }
    fetchData();
  }, []);
  return (
    <div>
      {login.isLoggedIn ? <h1>Nice Bro</h1> : null}
      <h1>Hello World</h1>
      <ToastContainer />
    </div>
  );
};

export default Homepage;
