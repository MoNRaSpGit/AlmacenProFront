import { useState, useEffect } from "react";
import { registrarPagoCaja, obtenerPagosCaja } from "../services/api";

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
    <div className="container bg-dark text-light py-4 min-vh-100">
      <h1 className="mb-4">📑 Pagos</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Nombre / Proveedor"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
          <button className="btn btn-danger" onClick={manejarRegistrar}>
            Registrar Pago
          </button>
        </div>
      </div>

      <h3>Historial de Pagos</h3>
      {pagos.length === 0 ? (
        <p>No hay pagos registrados</p>
      ) : (
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Monto</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>${Number(p.monto).toFixed(2)}</td>
                <td>{new Date(p.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
