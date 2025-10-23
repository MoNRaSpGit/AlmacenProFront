// src/main.js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";  // 👈 CAMBIO AQUÍ
import { CajaProvider } from "./context/CajaContext";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CajaProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </CajaProvider>
  </StrictMode>
);
