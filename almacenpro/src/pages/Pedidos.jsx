// src/pages/Pedidos.jsx
import { useEffect, useState } from "react";
import { obtenerPedidos } from "../services/api";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerPedidos();
        // Acepta distintos esquemas, pero asume array
        setPedidos(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error cargando pedidos:", e);
        setError("No se pudieron cargar los pedidos.");
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  if (cargando) {
    return (
      <div className="container py-4">
        <h2>📦 Pedidos</h2>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <h2>📦 Pedidos</h2>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="container py-4">
        <h2>📦 Pedidos</h2>
        <p className="text-muted">No hay pedidos todavía.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3">📦 Pedidos</h2>

      <div className="table-responsive">
        <table className="table table-dark table-striped table-bordered align-middle text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Items</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => {
              // Campos defensivos por si el backend cambia nombres
              const id = p.id ?? p.numero ?? p.order_id ?? "-";
              const cliente = p.cliente ?? p.customer ?? p.nombre ?? "—";
              const items = Array.isArray(p.items) ? p.items : [];
              const total =
                typeof p.total === "number"
                  ? p.total
                  : Number(p.monto ?? p.amount ?? 0);
              const estado = p.estado ?? p.status ?? "—";
              const fechaRaw =
                p.creado_at ?? p.created_at ?? p.fecha ?? p.date ?? null;
              const fecha = fechaRaw
                ? new Date(fechaRaw).toLocaleString("es-UY")
                : "—";

              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td style={{ textAlign: "left" }}>{cliente}</td>
                  <td style={{ textAlign: "left" }}>
                    {items.length === 0
                      ? "—"
                      : items
                          .map((it) => {
                            const nombre = it.name ?? it.producto ?? "Item";
                            const cant = it.cantidad ?? it.qty ?? 1;
                            return `${nombre} x${cant}`;
                          })
                          .join(", ")}
                  </td>
                  <td>${Number(total || 0).toFixed(2)}</td>
                  <td>{estado}</td>
                  <td>{fecha}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
