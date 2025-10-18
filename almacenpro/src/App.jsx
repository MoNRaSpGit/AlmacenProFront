// src/App.jsx
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import ScannerPage from "./pages/ScannerPage";
import Caja from "./pages/Caja";
import Pagos from "./pages/Pagos";
import ControlStock from "./pages/ControlStock";
import ImprimirQZ from "./pages/ImprimirQZ";


export default function App() {
  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">


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
                <NavLink className={linkClass} to="/scanner">Escáner</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={linkClass} to="/caja">Caja</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={linkClass} to="/pagos">Pagos</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={linkClass} to="/stock">Stock</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={linkClass} to="/imprimir">Impresión</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Si querés tu propio ancho, usá container-app en vez de .container */}
      <div className="container-app py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/scanner" replace />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/caja" element={<Caja />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/stock" element={<ControlStock />} />
          <Route path="/imprimir" element={<ImprimirQZ />} />


        </Routes>

      </div>
    </div>
  );
}
