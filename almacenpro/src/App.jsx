// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ScannerPage from "./pages/ScannerPage";
import Caja from "./pages/Caja";
import Pagos from "./pages/Pagos";
import ControlStock from "./pages/ControlStock";

export default function App() {
  return (
    <div className="bg-dark text-light min-vh-100">
      {/* 🚫 Ocultamos la barra de navegación mientras está en modo prueba */}
      {/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark"> ... </nav> */}

      {/* 💡 Contenedor principal agrandado, sin márgenes ni padding */}
      <div className="container-fluid py-2">
        <Routes>
          {/* 🔁 Redirige siempre al escáner (única vista visible) */}
          <Route path="*" element={<Navigate to="/scanner" replace />} />
          <Route path="/scanner" element={<ScannerPage />} />

          {/* 👇 Las demás rutas siguen existiendo, solo no se muestran */}
          <Route path="/caja" element={<Caja />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/stock" element={<ControlStock />} />
        </Routes>
      </div>
    </div>
  );
}
