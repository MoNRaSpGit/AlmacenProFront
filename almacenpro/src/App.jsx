// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ScannerPage from "./pages/ScannerPage";
import Caja from "./pages/Caja";
import Pagos from "./pages/Pagos";
import ControlStock from "./pages/ControlStock";
import NavBar from "./components/NavBar"; // ⬅️ nuevo
import Pedidos from "./pages/Pedidos"; // ⬅️ nuevo

export default function App() {
  return (
    <div className="bg-dark text-light min-vh-100">
      <NavBar /> {/* ⬅️ navbar fijo arriba */}

      {/* Contenedor principal */}
      <div className="container-fluid py-2">
        <Routes>
          {/* Redirige por defecto al escáner */}
          <Route path="*" element={<Navigate to="/scanner" replace />} />
          <Route path="/scanner" element={<ScannerPage />} />
           <Route path="/pedidos" element={<Pedidos />} /> {/* ⬅️ nuevo */}

          {/* Rutas existentes */}
          <Route path="/caja" element={<Caja />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/stock" element={<ControlStock />} />

          {/* Próximo paso: cuando tengas la página de Pedidos, agregamos: */}
          {/* <Route path="/pedidos" element={<Pedidos />} /> */}
        </Routes>
      </div>
    </div>
  );
}
