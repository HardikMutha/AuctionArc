import Homepage from "./Pages/Homepage";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginContext from "./contexts/LoginContext";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import SearchBar from "./components/SearchBar";

function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  return (
    <>
      <LoginContext.Provider value={{ isLoggedIn, setisLoggedIn }}>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </LoginContext.Provider>
    </>
  );
}

export default App;
