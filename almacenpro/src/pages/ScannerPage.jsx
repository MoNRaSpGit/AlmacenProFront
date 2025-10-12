import { useState } from "react";
import { registrarVenta, crearProductoRapido } from "../services/api";
import EntradaEscaner from "../components/EntradaEscaner";
import TarjetaProducto from "../components/TarjetaProducto";
import TarjetaIngresarProducto from "../components/TarjetaIngresarProducto";

export default function ScannerPage() {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);

  const [mostrarTarjeta, setMostrarTarjeta] = useState(false);
  const [codigoFaltante, setCodigoFaltante] = useState("");

 const manejarProductoEncontrado = (producto) => {
  setProductoSeleccionado(producto);

  setCarrito((prev) => {
    const existente = prev.find((p) => p.barcode === producto.barcode);

    // 🧠 Si ya existe el producto en el carrito
    if (existente) {
      // ✅ Evitamos doble actualización
      return prev.map((p) =>
        p.barcode === producto.barcode
          ? { ...p, cantidad: (p.cantidad || 0) + 1 }
          : p
      );
    }

    // 🆕 Si es nuevo producto, lo agregamos
    return [...prev, { ...producto, cantidad: 1 }];
  });
};


  const manejarProductoNoEncontrado = (codigo) => {
    setCodigoFaltante(codigo);
    setMostrarTarjeta(true);
  };

const manejarGuardarProductoNuevo = async ({ nombre, precio, codigo }) => {
  try {
    await crearProductoRapido(nombre, precio, codigo);

    const nuevoProducto = {
      name: nombre,
      price: precio,
      barcode: codigo,
      cantidad: 1,
    };

    setCarrito((prev) => [...prev, nuevoProducto]);
    setMostrarTarjeta(false);
    setCodigoFaltante(null);
  } catch (err) {
    console.error("Error guardando producto rápido:", err);
    alert("Error guardando el producto");
  }
};


  const manejarCancelar = () => {
    setMostrarTarjeta(false);
    setCodigoFaltante("");
  };

  const manejarEliminar = (barcode) => {
    setCarrito((prev) => {
      const index = prev.findIndex((p) => p.barcode === barcode);
      if (index >= 0) {
        const actualizado = [...prev];
        if (actualizado[index].cantidad > 1) {
          actualizado[index].cantidad -= 1;
          return actualizado;
        } else {
          return actualizado.filter((p) => p.barcode !== barcode);
        }
      }
      return prev;
    });
  };

  const calcularTotal = () =>
    carrito.reduce((total, p) => total + Number(p.price || 0) * p.cantidad, 0);

  const manejarPagar = async () => {
    const total = calcularTotal();
    if (total > 0) {
      try {
        await registrarVenta(total);
        alert(`✅ Pago registrado: $${total.toFixed(2)}`);
        setCarrito([]);
        setProductoSeleccionado(null);
      } catch {
        alert("❌ Error registrando la venta");
      }
    }
  };

  return (
  <>
    <div className="container-fluid min-vh-100 bg-dark text-light py-4">
      <h1 className="text-center mb-4">🛒 Escáner de Supermercado</h1>

      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <EntradaEscaner
            onProductoEncontrado={manejarProductoEncontrado}
            onProductoNoEncontrado={manejarProductoNoEncontrado}
          />
        </div>
      </div>

      <div className="row justify-content-center mb-5">
        <div className="col-md-4">
          <TarjetaProducto producto={productoSeleccionado} />
        </div>
      </div>

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
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
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
