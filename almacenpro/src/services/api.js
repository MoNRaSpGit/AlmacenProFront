import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// =====================
// 🧾 Productos
// =====================

// Obtener todos los productos
export async function obtenerProductos() {
  const res = await axios.get(`${API_URL}/api/products`);
  return res.data;
}

// ✅ Crear producto rápido (cuando no se encuentra en el escaneo)
export async function crearProductoRapido(nombre, precio, codigo) {
  const res = await axios.post(`${API_URL}/api/products/rapido`, {
    name: nombre,
    price: precio,
    barcode: codigo,
  });
  return res.data;
}

// ✅ Buscar producto por código de barras
export async function obtenerProductoPorCodigo(codigo) {
  try {
    const res = await axios.get(`${API_URL}/api/products/${codigo}`);
    return res.data;
  } catch (error) {
    throw new Error("Producto no encontrado");
  }
}

// =====================
// 💰 Caja
// =====================
export async function iniciarCaja(montoInicial) {
  const res = await axios.post(`${API_URL}/api/caja/abrir`, { montoInicial });
  return res.data;
}

export async function obtenerCajaActiva() {
  const res = await axios.get(`${API_URL}/api/caja/activa`);
  return res.data;
}

export async function cerrarCaja() {
  const res = await axios.post(`${API_URL}/api/caja/cerrar`);
  return res.data;
}

export async function registrarVenta(monto, productos) {
  const res = await axios.post(`${API_URL}/api/caja/venta`, { monto, productos });
  return res.data;
}


export async function registrarPagoCaja(nombre, monto) {
  const res = await axios.post(`${API_URL}/api/caja/pago`, { nombre, monto });
  return res.data;
}

export async function obtenerPagosCaja() {
  const res = await axios.get(`${API_URL}/api/pagos`);
  return res.data;
}


// =====================
// 📊 Movimientos de Caja
// =====================
export async function obtenerMovimientos() {
  const res = await axios.get(`${API_URL}/api/caja/movimientos`);
  return res.data;
}
