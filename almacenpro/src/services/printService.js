export function printWithRawBT(ticketTexto) {
  try {
    // Limpia el texto
    const cleanText = ticketTexto.trim();
    const encoded = encodeURIComponent(cleanText);

    // ✅ Esquema más estable: usa "intent:rawbt?data" con data= en lugar de S.data
    const intentUrl = `intent:rawbt?data=${encoded}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end`;

    // Abre RawBT directamente sin mostrar la URL
    window.location.replace(intentUrl);
  } catch (error) {
    console.error("Error enviando a RawBT:", error);
    alert("Error al imprimir con RawBT");
  }
}

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
  const totalTexto = `TOTAL: $${total.toFixed(2)}`;
  texto += margen(centrar(totalTexto)) + "\n";
  texto += margen("-".repeat(ANCHO_TOTAL)) + "\n";
  texto += margen(`Fecha: ${fecha}`) + "\n";
  texto += margen(centrar("Gracias por su compra!")) + "\n\n\n";

  return texto;
}
