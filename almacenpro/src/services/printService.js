// ==============================
// Servicio de impresión con RawBT (versión estable S.text)
// ==============================

export function printWithRawBT(ticketTexto) {
  try {
    const a = document.createElement("a");
    a.href = "rawbt://print?text=" + encodeURIComponent(ticketTexto.trim());
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();                    // algunos navegadores manejan distinto el click vs. location.href
    document.body.removeChild(a);
  } catch (e) {
    console.error("Error RawBT:", e);
    alert("Error al imprimir con RawBT");
  }
}



export function generarTicketTexto(items) {
  const fecha = new Date().toLocaleString("es-UY");
  const ANCHO_TOTAL = 32;

  // mismo margen que usás en el resto del ticket
  const margen = (texto) => "   " + texto; // 3 espacios

  let texto = "";

  // 👉 salto de línea para empujar cualquier “//print…” a la línea anterior
  texto += "\n";

  // 👉 encabezado alineado a la izquierda, donde empieza la columna de Producto
  texto += margen("KIOSCO PILOTO") + "\n";

  // líneas y tabla
  texto += margen("-".repeat(ANCHO_TOTAL)) + "\n";
  texto += margen("Producto        Cant   Precio") + "\n";
  texto += margen("-".repeat(ANCHO_TOTAL)) + "\n";

  let total = 0;
  for (const item of items) {
    const nombre = item.name.slice(0, 14).padEnd(14, " ");
    const cantidad = String(item.cantidad).padStart(4, " ");
    const precio = (item.price * item.cantidad).toFixed(2).padStart(10, " ");
    texto += margen(`${nombre}${cantidad}${precio}`) + "\n";
    total += item.price * item.cantidad;
  }

  texto += margen("-".repeat(ANCHO_TOTAL)) + "\n";

  // total centrado pero respetando el mismo margen visual
  const totalTexto = `TOTAL: $${total.toFixed(2)}`;
  const espacios = Math.max(0, Math.floor((ANCHO_TOTAL - totalTexto.length) / 2));
  texto += margen(" ".repeat(espacios) + totalTexto) + "\n";

  texto += margen("-".repeat(ANCHO_TOTAL)) + "\n";
  texto += margen(`Fecha: ${fecha}`) + "\n";
  texto += margen("Gracias por sus compra!") + "\n\n\n";

  return texto;
}

