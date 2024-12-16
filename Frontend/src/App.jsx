import Homepage from "./Pages/Homepage";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginContext from "./contexts/LoginContext";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
function App() {
  const loginContext = {
    isLoggedIn: false,
  };
  return (
    <>
      <LoginContext.Provider value={loginContext}>
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
