import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage.tsx";
import NewProduct from "./components/NewProduct.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="font-serif">
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/new-product" element={<NewProduct />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  </StrictMode>
);
