// ==============================
// 📱 Servicio de impresión con RawBT
// ==============================

// 🧾 Función principal para imprimir un ticket desde RawBT
export function printWithRawBT(ticketTexto) {
  try {
    // ✅ Eliminamos cualquier prefijo extraño o espacios
    const cleanText = ticketTexto.trim();

    // ✅ Codificamos solo el texto (sin "intent://" visible)
    const encoded = encodeURIComponent(cleanText);

    // ✅ RawBT reconoce este formato como texto ESC/POS sin mostrar la URL
    const rawbtUrl = `intent:rawbt?data=${encoded}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end`;

    window.location.href = rawbtUrl; // Abre RawBT directamente
  } catch (error) {
    console.error("❌ Error enviando a RawBT:", error);
    alert("Error al imprimir con RawBT");
  }
}

// 🧠 Helper: genera texto del ticket a partir del carrito
export function generarTicketTexto(items) {
  const fecha = new Date().toLocaleString("es-UY");

  // Utilidad para centrar texto (ancho aproximado 32 caracteres)
  const centrar = (texto) => {
    const ancho = 32;
    const espacios = Math.max(0, Math.floor((ancho - texto.length) / 2));
    return " ".repeat(espacios) + texto;
  };

  let texto = "";
  texto += centrar("🏪 KIOSCO PILOTO") + "\n";
  texto += centrar("------------------------------") + "\n";
  texto += centrar("Producto       Cant   Precio") + "\n";
  texto += centrar("------------------------------") + "\n";

  let total = 0;
  for (const item of items) {
    const nombre = item.name.slice(0, 14).padEnd(14, " ");
    const cant = String(item.cantidad).padStart(3, " ");
    const precio = (item.price * item.cantidad).toFixed(2).padStart(8, " ");
    texto += `${nombre}${cant}${precio}\n`;
    total += item.price * item.cantidad;
  }

  texto += centrar("------------------------------") + "\n";
  texto += centrar(`TOTAL: $${total.toFixed(2)}`) + "\n";
  texto += centrar("------------------------------") + "\n";
  texto += centrar(`Fecha: ${fecha}`) + "\n\n";
  texto += centrar("Gracias por su compra!") + "\n\n\n\n";

  return texto;
}
