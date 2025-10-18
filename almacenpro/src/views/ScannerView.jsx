import { useState, useEffect, useRef } from "react";
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
  manejarCambioCantidad,   // 👈 DES-ESTRUCTURADO AQUÍ
  manejarPagar,
  calcularTotal,
  manejarAgregarManual,
}) {
  const [precioManual, setPrecioManual] = useState("");
  const [mostrarInput, setMostrarInput] = useState(false);
  const inputPrecioRef = useRef(null);
  const inputEscanerRef = useRef(null);

  useEffect(() => {
    inputEscanerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (mostrarInput) setTimeout(() => inputPrecioRef.current?.focus(), 100);
  }, [mostrarInput]);

  const volverAFocoEscaner = () => {
    setTimeout(() => inputEscanerRef.current?.focus(), 150);
  };

  return (
    <>
      <div className="container-fluid min-vh-100 bg-dark text-light py-4">
        <h1 className="text-center mb-4">🛒 Escáner des Supermercado</h1>

        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <EntradaEscaner
              inputRef={inputEscanerRef}
              onProductoEncontrado={manejarProductoEncontrado}
              onProductoNoEncontrado={manejarProductoNoEncontrado}
            />

            {/* Agregar manual */}
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
                    ref={inputPrecioRef}
                    type="number"
                    className="form-control"
                    placeholder="Precio"
                    value={precioManual}
                    onChange={(e) => setPrecioManual(e.target.value)}
                  />
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      manejarAgregarManual(precioManual);
                      setPrecioManual("");
                      setMostrarInput(false);
                      volverAFocoEscaner();
                    }}
                  >
                    ✅
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setMostrarInput(false);
                      setPrecioManual("");
                      volverAFocoEscaner();
                    }}
                  >
                    ❌
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Producto actual */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-4">
            <TarjetaProducto producto={productoSeleccionado} />
          </div>
        </div>

        {/* Carrito */}
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
                    {carrito.map((p, idx) => (
                      <tr key={`${p.barcode}-${idx}`}>
                        <td>
                          {p.image && (
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: 50, height: 50, objectFit: "cover" }}
                            />
                          )}
                        </td>
                        <td>{p.name}</td>
                        <td>${p.price}</td>

                        {/* Cantidad táctil */}
                        <td>
                          <div
                            className="d-flex align-items-center justify-content-center gap-2"
                            style={{ touchAction: "manipulation" }}
                          >
                            <button
                              className="btn btn-sm btn-secondary"
                              style={{ fontSize: "1.6rem", padding: "0.5rem 0.9rem" }}
                              onClick={() =>
                                p.cantidad > 1 &&
                                manejarCambioCantidad(p.barcode, p.cantidad - 1)
                              }
                            >
                              ➖
                            </button>

                            <span
                              style={{
                                fontSize: "1.6rem",
                                minWidth: 50,
                                textAlign: "center",
                                display: "inline-block",
                              }}
                            >
                              {p.cantidad}
                            </span>

                            <button
                              className="btn btn-sm btn-success"
                              style={{ fontSize: "1.6rem", padding: "0.5rem 0.9rem" }}
                              onClick={() =>
                                manejarCambioCantidad(p.barcode, p.cantidad + 1)
                              }
                            >
                              ➕
                            </button>
                          </div>
                        </td>

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
                  <button
                    className="btn btn-success btn-lg"
                    onClick={async () => {
                      await manejarPagar();
                      volverAFocoEscaner();
                    }}
                  >
                    💳 Pagar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

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
