import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage.tsx";
import AddProduct from "./Pages/AddProduct.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="font-serif">
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/new-product" element={<AddProduct />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  </StrictMode>
);
