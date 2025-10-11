import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CajaProvider } from "./context/CajaContext";
import App from "./App.jsx";
import "./styles/global.css";
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CajaProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CajaProvider>
  </StrictMode>
);












