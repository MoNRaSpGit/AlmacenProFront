export default function PagosView({
  nombre,
  setNombre,
  monto,
  setMonto,
  pagos,
  manejarRegistrar,
}) {
  return (
    <div className="container bg-dark text-light py-4 min-vh-100">
      <h1 className="mb-4 text-center">📑 Pagos</h1>

      {/* Formulario de registro de pagos */}
      <div className="row mb-4 justify-content-center">
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
          <button className="btn btn-danger w-100" onClick={manejarRegistrar}>
            Registrar Pago
          </button>
        </div>
      </div>

      {/* Tabla de historial de pagos */}
      <h3 className="text-center mb-3">Historial de Pagos</h3>
      {pagos.length === 0 ? (
        <p className="text-center">No hay pagos registrados</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-striped align-middle text-center">
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
        </div>
      )}
    </div>
  );
}
