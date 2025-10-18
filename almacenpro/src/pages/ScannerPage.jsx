import { useState } from "react";
import { registrarVenta, crearProductoRapido } from "../services/api";
import ScannerView from "../views/ScannerView";
import Notificacion from "../components/Notificacion";

export default function ScannerPage() {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [mostrarTarjeta, setMostrarTarjeta] = useState(false);
  const [codigoFaltante, setCodigoFaltante] = useState("");
  const [notificacion, setNotificacion] = useState(null);

  // ✅ Producto encontrado
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

  // ❌ Producto no encontrado
  const manejarProductoNoEncontrado = (codigo) => {
    setCodigoFaltante(codigo);
    setMostrarTarjeta(true);
  };

  // 🆕 Guardar nuevo producto
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
      alert("❌ Error guardando el producto");
    }
  };

  // 🔙 Cancelar
  const manejarCancelar = () => {
    setMostrarTarjeta(false);
    setCodigoFaltante("");
  };

  // 🗑️ Eliminar producto o reducir cantidad
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

  // ✏️ Editar cantidad (modo tablet)
  const manejarEditarCantidad = (barcode) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.barcode === barcode
          ? { ...p, editando: true, cantidadTemp: p.cantidad }
          : p
      )
    );
  };

  const manejarCambioTemporal = (barcode, valor) => {
    const num = Number(valor);
    if (isNaN(num) || num < 0) return;
    setCarrito((prev) =>
      prev.map((p) =>
        p.barcode === barcode ? { ...p, cantidadTemp: num } : p
      )
    );
  };

  const manejarConfirmarCantidad = (barcode) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.barcode === barcode
          ? {
              ...p,
              cantidad: p.cantidadTemp > 0 ? p.cantidadTemp : p.cantidad,
              editando: false,
              cantidadTemp: undefined,
            }
          : p
      )
    );
  };

  // 💰 Calcular total
  const calcularTotal = () =>
    carrito.reduce((total, p) => total + Number(p.price || 0) * p.cantidad, 0);

  // 💳 Pagar
  const manejarPagar = async () => {
    const total = calcularTotal();
    if (total > 0) {
      try {
        const productosFormateados = carrito.map((p) => ({
          id: p.id || null,
          cantidad: p.cantidad,
          precio: p.price,
        }));

        await registrarVenta(total, productosFormateados);

        setCarrito([]);
        setProductoSeleccionado(null);
        setNotificacion({
          mensaje: `✅ Pago registrado: $${total.toFixed(2)}`,
          tipo: "exito",
        });
      } catch {
        setNotificacion({
          mensaje: "❌ Error registrando la venta",
          tipo: "error",
        });
      }
    }
  };

  // 🧾 Producto manual
  const ID_PRODUCTO_MANUAL = 1689;
  const manejarAgregarManual = (precio) => {
    if (!precio || precio <= 0) return alert("Ingrese un precio válido");
    const productoManual = {
      id: ID_PRODUCTO_MANUAL,
      name: "Producto manual",
      price: Number(precio),
      barcode: "manual",
      cantidad: 1,
    };
    setCarrito((prev) => [...prev, productoManual]);
  };

  return (
    <>
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
        manejarAgregarManual={manejarAgregarManual}
        manejarEditarCantidad={manejarEditarCantidad}
        manejarCambioTemporal={manejarCambioTemporal}
        manejarConfirmarCantidad={manejarConfirmarCantidad}
      />

      {notificacion && (
        <Notificacion
          mensaje={notificacion.mensaje}
          tipo={notificacion.tipo}
          onClose={() => setNotificacion(null)}
        />
      )}
    </>
  );
}
