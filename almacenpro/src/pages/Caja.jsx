import { useEffect, useState } from "react";
import { iniciarCaja, obtenerCajaActiva, cerrarCaja, obtenerMovimientos } from "../services/api";

export default function Caja() {
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
    } catch (err) {
      alert("Error al iniciar caja");
    }
  };

  const manejarCerrar = async () => {
    try {
      await cerrarCaja();
      alert("✅ Caja cerrada");
      setCaja(null);
      setMovimientos([]);
    } catch (err) {
      alert("Error al cerrar caja");
    }
  };

  useEffect(() => {
    cargarCaja();
    cargarMovimientos();
  }, []);

  return (
    <div className="container bg-dark text-light py-4 min-vh-100">
      <h1 className="mb-4 text-center">💰 Caja</h1>

      {!caja ? (
        <div className="card bg-secondary text-light p-4 mx-auto" style={{ maxWidth: "400px" }}>
          <h4 className="mb-3">Iniciar Caja</h4>
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Monto inicial"
            value={montoInicial}
            onChange={(e) => setMontoInicial(e.target.value)}
          />
          <button className="btn btn-success w-100" onClick={manejarAbrir}>
            🚀 Abrir Caja
          </button>
        </div>
      ) : (
        <>
          {/* Tarjetas de caja */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-success text-light p-3">
                <h5>📅 Fecha</h5>
                <p>{new Date(caja.fecha).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-primary text-light p-3">
                <h5>💵 Monto Inicial</h5>
                <p>${Number(caja.monto_inicial).toFixed(2)}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-warning text-dark p-3">
                <h5>📊 Saldo Actual</h5>
                <p>${Number(caja.monto_total).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <button className="btn btn-danger w-100 mb-4" onClick={manejarCerrar}>
            🔒 Cerrar Caja
          </button>

          {/* Movimientos */}
          <h3 className="mb-3">📑 Movimientos de Hoy</h3>
          {movimientos.length === 0 ? (
            <p>No hay movimientos registrados</p>
          ) : (
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((m) => (
                  <tr key={m.id}>
                    <td>
                      {new Date(m.fecha).toLocaleDateString()} -{" "}
                      {new Date(m.fecha).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td>{m.descripcion}</td>
                    <td
                      style={{
                        color: m.tipo === "ingreso" ? "lightgreen" : "salmon",
                        fontWeight: "bold",
                      }}
                    >
                      {m.tipo === "ingreso" ? "+" : "-"}${Number(m.monto).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
