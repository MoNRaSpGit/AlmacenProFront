import { useEffect, useState } from "react";
import { iniciarCaja, obtenerCajaActiva, cerrarCaja, obtenerMovimientos } from "../services/api";
import CajaView from "../views/CajaView";

export default function CajaPage() {
  const [caja, setCaja] = useState(null);
  const [montoInicial, setMontoInicial] = useState("");
  const [movimientos, setMovimientos] = useState([]);

  const cargarCaja = async () => {
    try {
      const data = await obtenerCajaActiva();
      setCaja(data || null);
    } catch (err) {
      console.error("Error cargando caja:", err.message);
    }
  };

  const cargarMovimientos = async () => {
    try {
      const data = await obtenerMovimientos();
      setMovimientos(data || []);
    } catch (err) {
      console.error("Error cargando movimientos:", err.message);
    }
  };

  const manejarAbrir = async () => {
    if (!montoInicial) return alert("Ingrese un monto inicial");
    try {
      await iniciarCaja(Number(montoInicial));
      setMontoInicial("");
      await cargarCaja();
      await cargarMovimientos();
    } catch {
      alert("Error al iniciar caja");
    }
  };

  const manejarCerrar = async () => {
    try {
      await cerrarCaja();
      alert("✅ Caja cerrada");
      setCaja(null);
      setMovimientos([]);
    } catch {
      alert("Error al cerrar caja");
    }
  };

  useEffect(() => {
    cargarCaja();
    cargarMovimientos();
  }, []);

  return (
    <CajaView
      caja={caja}
      montoInicial={montoInicial}
      setMontoInicial={setMontoInicial}
      movimientos={movimientos}
      manejarAbrir={manejarAbrir}
      manejarCerrar={manejarCerrar}
    />
  );
}
