import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("An Error Occured in Auth Context Setup");
  }
  return authContext;
};

export default useAuthContext;
