import { useState } from "react";
import { registrarVenta, crearProductoRapido } from "../services/api";
import ScannerView from "../views/ScannerView";


export default function ScannerPage() {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [mostrarTarjeta, setMostrarTarjeta] = useState(false);
  const [codigoFaltante, setCodigoFaltante] = useState("");

  const manejarProductoEncontrado = (producto) => {
    setProductoSeleccionado(producto);
    setCarrito((prev) => {
      const existente = prev.find((p) => p.barcode === producto.barcode);
      if (existente) {
        return prev.map((p) =>
          p.barcode === producto.barcode
            ? { ...p, cantidad: (p.cantidad || 0) + 1 }
            : p
        );
      }
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

  const manejarAgregarManual = (precio) => {
  if (!precio || precio <= 0) return alert("Ingrese un precio válido");

  const productoManual = {
    name: "Producto manual",
    price: Number(precio),
    barcode: "manual-" + Date.now(),
    cantidad: 1,
  };

  setCarrito((prev) => [...prev, productoManual]);
};


  return (
    <ScannerView
      productoSeleccionado={productoSeleccionado}
      carrito={carrito}
      mostrarTarjeta={mostrarTarjeta}
      codigoFaltante={codigoFaltante}
      manejarProductoEncontrado={manejarProductoEncontrado}
      manejarProductoNoEncontrado={manejarProductoNoEncontrado}
      manejarGuardarProductoNuevo={manejarGuardarProductoNuevo}
      manejarCancelar={manejarCancelar}
      manejarEliminar={manejarEliminar}
      manejarPagar={manejarPagar}
      calcularTotal={calcularTotal}
      manejarAgregarManual={manejarAgregarManual} // 👈 agregado
    />
  );
}
