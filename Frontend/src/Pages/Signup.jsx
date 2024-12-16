import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginContext from "../contexts/LoginContext";
const Signup = () => {
  const navigate = useNavigate();
  const loginContext = useContext(LoginContext);
  if (loginContext.isLoggedIn == false) return navigate("/");
  return (
    <div>
      <h1>Signup</h1>
    </div>
  );
};

export default Signup;
