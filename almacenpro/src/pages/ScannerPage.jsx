import { useState } from "react";
import { registrarVenta, crearProductoRapido } from "../services/api";
import {
  connectQZ,
  getDefaultPrinter,
  printTestTicket,
  printWithRawBT,
} from "../services/printService";
import ScannerView from "../views/ScannerView";
import Notificacion from "../components/Notificacion";

export default function ScannerPage() {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [mostrarTarjeta, setMostrarTarjeta] = useState(false);
  const [codigoFaltante, setCodigoFaltante] = useState("");
  const [notificacion, setNotificacion] = useState(null);

  // ✅ Detectar si es Android (para RawBT)
  const isAndroid = () => /Android/i.test(navigator.userAgent);

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

  // 🔢 Cambiar cantidad desde botones ➕ / ➖
  const manejarCambioCantidad = (barcode, nuevaCantidad) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.barcode === barcode
          ? { ...p, cantidad: Math.max(1, nuevaCantidad) }
          : p
      )
    );
  };

  // 💰 Calcular total
  const calcularTotal = () =>
    carrito.reduce((total, p) => total + Number(p.price || 0) * p.cantidad, 0);

  // 💳 Pagar + imprimir (QZ Tray o RawBT)
  const manejarPagar = async () => {
    const total = calcularTotal();
    if (total <= 0) return;

    try {
      const productosFormateados = carrito.map((p) => ({
        id: p.id || null,
        cantidad: p.cantidad,
        precio: p.price,
      }));

      // Registrar venta en backend
      await registrarVenta(total, productosFormateados);

      // Preparar lista para imprimir
      const listaTicket = carrito.map((p) => ({
        nombre: `${p.name} x${p.cantidad}`,
        precio: `$${(p.price * p.cantidad).toFixed(2)}`,
      }));

      if (isAndroid()) {
        // 📱 RAWBT: Ticket en texto simple
        const texto = [
          "        KIOSCO PILOTO\n",
          "   Tacuarembó - Uruguay\n",
          "-------------------------------",
          ...listaTicket.map((p) => `${p.nombre}\n        ${p.precio}`),
          "-------------------------------",
          `TOTAL: $${total.toFixed(2)}\n`,
          "\nGracias por su compra!\n\n\n",
        ].join("\n");

        printWithRawBT(texto);
      } else {
        // 💻 QZ Tray (PC)
        await connectQZ();
        const printer = await getDefaultPrinter();
        await printTestTicket(printer, listaTicket);
      }

      // Limpiar carrito y mostrar confirmación
      setCarrito([]);
      setProductoSeleccionado(null);
      setNotificacion({
        mensaje: `✅ Pago registrado e impreso: $${total.toFixed(2)}`,
        tipo: "exito",
      });
    } catch (err) {
      console.error("❌ Error registrando o imprimiendo:", err);
      setNotificacion({
        mensaje: "❌ Error registrando la venta o imprimiendo",
        tipo: "error",
      });
    }
  };

  // 🧾 Agregar producto manual
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
        manejarCambioCantidad={manejarCambioCantidad}
        manejarPagar={manejarPagar}
        calcularTotal={calcularTotal}
        manejarAgregarManual={manejarAgregarManual}
        volverAFocoEscaner={() => {}}
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
