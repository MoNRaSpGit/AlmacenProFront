// src/App.jsx
import { Routes, Route, NavLink } from "react-router-dom";
import Inicio from "./pages/Inicio";
import ScannerPage from "./pages/ScannerPage";
import Caja from "./pages/Caja";
import Pagos from "./pages/Pagos";

export default function App() {
  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand" to="/">AlmacénPro</NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#nav"
            aria-controls="nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div id="nav" className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink className={linkClass} to="/">Inicio</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={linkClass} to="/scanner">Escáner</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={linkClass} to="/caja">Caja</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={linkClass} to="/pagos">Pagos</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Si querés tu propio ancho, usá container-app en vez de .container */}
      <div className="container-app py-4">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/caja" element={<Caja />} />
          <Route path="/pagos" element={<Pagos />} />
        </Routes>
      </div>
    </div>
  );
}
