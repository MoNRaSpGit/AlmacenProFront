import { useState, useEffect } from "react";
import { registrarPagoCaja, obtenerPagosCaja } from "../services/api";
import PagosView from "../views/PagosView";

export default function Pagos() {
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [pagos, setPagos] = useState([]);

  const cargarPagos = async () => {
    try {
      const data = await obtenerPagosCaja();
      setPagos(data);
    } catch (err) {
      console.error("Error cargando pagos:", err.message);
    }
  };

  const manejarRegistrar = async () => {
    if (!nombre || !monto) return alert("Complete los campos");
    try {
      await registrarPagoCaja(nombre, Number(monto));
      setNombre("");
      setMonto("");
      cargarPagos();
      alert("✅ Pago registrado");
    } catch (err) {
      alert("❌ Error registrando el pago");
    }
  };

  useEffect(() => {
    cargarPagos();
  }, []);

  return (
    <PagosView
      nombre={nombre}
      setNombre={setNombre}
      monto={monto}
      setMonto={setMonto}
      pagos={pagos}
      manejarRegistrar={manejarRegistrar}
    />
  );
}
