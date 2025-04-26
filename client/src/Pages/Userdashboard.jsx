import { useState } from "react";
import Spinner from "../components/Spinner";
import Dashboard from "../components/Dashboard";
import useAuthContext from "../hooks/useAuthContext";

const Userdashboard = () => {
  const { state, dispatch } = useAuthContext();
  return (
    <>
      <div>
        {state.isLoading ? <Spinner /> : <Dashboard data={state?.user} />}
      </div>
    </>
  );
};

export default Userdashboard;
