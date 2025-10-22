import { useState, useEffect, useRef } from "react";
import EntradaEscaner from "../components/EntradaEscaner";
import TarjetaIngresarProducto from "../components/TarjetaIngresarProducto";

export default function ScannerView({
  carrito,
  mostrarTarjeta,
  codigoFaltante,
  manejarProductoEncontrado,
  manejarProductoNoEncontrado,
  manejarGuardarProductoNuevo,
  manejarCancelar,
  manejarEliminar,
  manejarCambioCantidad,
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
        <h1 className="text-center mb-4" style={{ fontSize: "2rem" }}>
          🛒 Escáner de Productos
        </h1>

        {/* 🔍 Campo del lector */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-6 col-lg-5">
            <EntradaEscaner
              inputRef={inputEscanerRef}
              onProductoEncontrado={manejarProductoEncontrado}
              onProductoNoEncontrado={manejarProductoNoEncontrado}
            />

            {/* ➕ Agregar manual */}
            <div className="d-flex justify-content-center mt-3">
              {!mostrarInput ? (
                <button
                  className="btn btn-warning btn-lg px-4 py-3"
                  style={{ fontSize: "1.3rem" }}
                  onClick={() => setMostrarInput(true)}
                >
                  ➕ Agregar manual
                </button>
              ) : (
                <div className="input-group w-75">
                  <input
                    ref={inputPrecioRef}
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Precio"
                    value={precioManual}
                    onChange={(e) => setPrecioManual(e.target.value)}
                  />
                  <button
                    className="btn btn-success btn-lg"
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
                    className="btn btn-secondary btn-lg"
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

        {/* 🧾 Lista del carrito (solo esta parte visible) */}
        <div className="row">
          <div className="col-12 px-3">
            {carrito.length === 0 ? (
              <p
                className="text-center text-muted"
                style={{ fontSize: "1.6rem" }}
              >
                No hay productos escaneados aún
              </p>
            ) : (
              <>
                <table
                  className="table table-dark table-striped table-bordered align-middle text-center shadow-lg"
                  style={{ fontSize: "1.5rem" }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#222" }}>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cant.</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {carrito.map((p, idx) => (
                      <tr key={`${p.barcode}-${idx}`}>
                        <td
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            fontSize: "1.4rem",
                          }}
                        >
                          {p.name}
                        </td>
                        <td>${p.price}</td>

                        {/* 🔢 Controles táctiles ➕ ➖ */}
                        <td>
                          <div
                            className="d-flex align-items-center justify-content-center gap-3"
                            style={{ touchAction: "manipulation" }}
                          >
                            <button
                              className="btn btn-secondary btn-lg"
                              style={{
                                fontSize: "1.8rem",
                                padding: "0.4rem 0.9rem",
                              }}
                              onClick={() =>
                                p.cantidad > 1 &&
                                manejarCambioCantidad(p.barcode, p.cantidad - 1)
                              }
                            >
                              ➖
                            </button>

                            <span
                              style={{
                                fontSize: "1.8rem",
                                minWidth: 60,
                                display: "inline-block",
                                textAlign: "center",
                              }}
                            >
                              {p.cantidad}
                            </span>

                            <button
                              className="btn btn-success btn-lg"
                              style={{
                                fontSize: "1.8rem",
                                padding: "0.4rem 0.9rem",
                              }}
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
                            className="btn btn-danger btn-lg"
                            style={{ fontSize: "1.5rem" }}
                            onClick={() => manejarEliminar(p.barcode)}
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr style={{ backgroundColor: "#333" }}>
                      <td colSpan="3" className="text-end fw-bold">
                        Total:
                      </td>
                      <td colSpan="2" className="fw-bold">
                        ${calcularTotal().toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <div className="text-end mt-4">
                  <button
                    className="btn btn-success btn-lg px-5 py-3"
                    style={{ fontSize: "1.8rem" }}
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

      {/* ⚠️ Modal de producto nuevo */}
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
