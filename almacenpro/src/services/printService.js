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
  const FEED_LINEAS = 8; // ⬅️ cantidad de líneas en blanco al final

  const margen = (texto) => "   " + texto; // mismo margen
  const centrar = (texto) => {
    const esp = Math.max(0, Math.floor((ANCHO_TOTAL - texto.length) / 2));
    return " ".repeat(esp) + texto;
  };

  let texto = "";
  texto += "\n"; // empuja posibles prefijos del intent a la línea anterior
  texto += margen("KIOSCO PILOTO") + "\n";
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
  texto += margen(centrar(`TOTAL: $${total.toFixed(2)}`)) + "\n";
  texto += margen("-".repeat(ANCHO_TOTAL)) + "\n";
  texto += margen(`Fecha: ${fecha}`) + "\n";
  texto += margen("Gracias por su compra!") + "\n";

  // ⬇️ Alimenta papel: agrega líneas en blanco
  texto += "\n".repeat(FEED_LINEAS);

  return texto;
}


