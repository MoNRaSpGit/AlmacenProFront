// ==============================
// Servicio de impresión con RawBT (versión estable S.text)
// ==============================

export function printWithRawBT(ticketTexto) {
  try {
    const encoded = encodeURIComponent(ticketTexto.trim());
    
    window.open(`intent://print?text=${encoded}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end`, "_system");

  } catch (error) {
    console.error("❌ Error enviando a RawBT:", error);
    alert("Error al imprimir con RawBT");
  }
}


// Generador del texto del ticket
export function generarTicketTexto(items) {
  const fecha = new Date().toLocaleString("es-UY");
  const ANCHO_TOTAL = 32;

  const centrar = (texto) => {
    const espacios = Math.max(0, Math.floor((ANCHO_TOTAL - texto.length) / 2));
    return " ".repeat(espacios) + texto;
  };

  const margen = (texto) => "   " + texto;

  let texto = "";
  texto += margen(centrar("KIOSCO PILOTO")) + "\n";
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
  texto += margen(centrar("Gracias por su compra!")) + "\n\n\n";

  return texto;
}
