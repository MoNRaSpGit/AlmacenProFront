// src/main.js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CajaProvider } from "./context/CajaContext";
import App from "./App.jsx";

// 1) Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// 2) Bootstrap JS bundle (incluye Popper) 👉 NECESARIO para el collapse
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// 3) Tu CSS global DESPUÉS, así sobreescribe lo que necesites
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CajaProvider>
      <BrowserRouter basename="/AlmacenProFront">
        <App />
      </BrowserRouter>
    </CajaProvider>
  </StrictMode>
);
