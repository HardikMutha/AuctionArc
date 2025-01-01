import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import LoginContext from "../contexts/LoginContext";
import Spinner from "../components/Spinner";
import Dashboard from "../components/Dashboard";

const Userdashboard = () => {
  const [loading, setLoading] = useState(true);
  const login = useContext(LoginContext);
  const navigate = useNavigate();
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await axios.post(
          `http://localhost:3000/auth/authenticate-user`,
          {},
          { withCredentials: true }
        );
        if (response.status == 200) {
          login.setisLoggedIn(true);
          localStorage.setItem("user", JSON.stringify(response.data));
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    }
    checkLogin();
  }, []);
  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <Dashboard data={JSON.parse(localStorage.getItem("user"))} />
      )}
    </div>
  );
};

export default Userdashboard;
