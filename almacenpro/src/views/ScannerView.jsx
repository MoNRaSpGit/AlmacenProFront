import { useState } from "react";
import EntradaEscaner from "../components/EntradaEscaner";
import TarjetaProducto from "../components/TarjetaProducto";
import TarjetaIngresarProducto from "../components/TarjetaIngresarProducto";

export default function ScannerView({
  productoSeleccionado,
  carrito,
  mostrarTarjeta,
  codigoFaltante,
  manejarProductoEncontrado,
  manejarProductoNoEncontrado,
  manejarGuardarProductoNuevo,
  manejarCancelar,
  manejarEliminar,
  manejarPagar,
  calcularTotal,
  manejarAgregarManual, // 👈 NUEVO PROP RECIBIDO
}) {
  const [precioManual, setPrecioManual] = useState("");
  const [mostrarInput, setMostrarInput] = useState(false);

  return (
    <>
      <div className="container-fluid min-vh-100 bg-dark text-light py-4">
        <h1 className="text-center mb-4">🛒 Escáner de Supermercado</h1>

        {/* Entrada del escáner */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <EntradaEscaner
              onProductoEncontrado={manejarProductoEncontrado}
              onProductoNoEncontrado={manejarProductoNoEncontrado}
            />

            {/* 🆕 BOTÓN / INPUT MANUAL */}
            <div className="d-flex justify-content-center mt-3">
              {!mostrarInput ? (
                <button
                  className="btn btn-warning"
                  onClick={() => setMostrarInput(true)}
                >
                  ➕ Agregar manual
                </button>
              ) : (
                <div className="input-group w-75">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Precio"
                    value={precioManual}
                    onChange={(e) => setPrecioManual(e.target.value)}
                  />
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      manejarAgregarManual(precioManual); // 👈 SE USA AQUÍ
                      setPrecioManual("");
                      setMostrarInput(false);
                    }}
                  >
                    ✅
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setMostrarInput(false)}
                  >
                    ❌
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta del producto seleccionado */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-4">
            <TarjetaProducto producto={productoSeleccionado} />
          </div>
        </div>

        {/* Lista del carrito */}
        <div className="row">
          <div className="col-md-10 mx-auto">
            <h3>Lista de productos</h3>
            {carrito.length === 0 ? (
              <p>No hay productos escaneados</p>
            ) : (
              <>
                <table className="table table-dark table-striped align-middle">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((p) => (
                      <tr key={p.barcode}>
                        <td>
                          {p.image && (
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </td>
                        <td>{p.name}</td>
                        <td>${p.price}</td>
                        <td>{p.cantidad}</td>
                        <td>${(p.price * p.cantidad).toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => manejarEliminar(p.barcode)}
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="text-end">
                        <strong>Total</strong>
                      </td>
                      <td colSpan="2">
                        <strong>${calcularTotal().toFixed(2)}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <div className="text-end mt-3">
                  <button className="btn btn-success btn-lg" onClick={manejarPagar}>
                    💳 Pagar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tarjeta de ingreso de producto nuevo */}
      {mostrarTarjeta && (
        <TarjetaIngresarProducto
          codigo={codigoFaltante}
          onGuardar={manejarGuardarProductoNuevo}
          onCancelar={manejarCancelar}
        />
      )}
    </>
  );
}
