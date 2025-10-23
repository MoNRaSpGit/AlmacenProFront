// ==============================
// 📱 Servicio de impresión con RawBT
// ==============================

// 🧾 Función principal para imprimir un ticket desde RawBT
export function printWithRawBT(ticketTexto) {
  try {
    const cleanText = ticketTexto.trim();
    const encoded = encodeURIComponent(cleanText);

    // ✅ La forma correcta que evita mostrar "rawbt?data="
    const rawbtUrl = `intent:rawbt?data=${encoded}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end`;

    window.location.href = rawbtUrl;
  } catch (error) {
    console.error("❌ Error enviando a RawBT:", error);
    alert("Error al imprimir con RawBT");
  }
}


// 🧠 Helper: genera texto del ticket a partir del carrito
export function generarTicketTexto(items) {
  const fecha = new Date().toLocaleString("es-UY");

  // 🧮 Ancho total estándar para papel de 80 mm → 32 caracteres
  const ANCHO_TOTAL = 32;

  // Función para centrar texto en el ancho total
  const centrar = (texto) => {
    const espacios = Math.max(0, Math.floor((ANCHO_TOTAL - texto.length) / 2));
    return " ".repeat(espacios) + texto;
  };

  let texto = "";
  texto += centrar("🏪 KIOSCO PILOTO") + "\n";
  texto += "-".repeat(ANCHO_TOTAL) + "\n";
  texto += "Producto        Cant   Precio\n";
  texto += "-".repeat(ANCHO_TOTAL) + "\n";

  let total = 0;
  for (const item of items) {
    // ✍️ Ajustamos los anchos fijos por columna
    const nombre = item.name.slice(0, 14).padEnd(14, " "); // 14 caracteres
    const cantidad = String(item.cantidad).padStart(4, " "); // 4 caracteres
    const precio = (item.price * item.cantidad).toFixed(2).padStart(10, " "); // 10 caracteres → derecha

    texto += `${nombre}${cantidad}${precio}\n`;
    total += item.price * item.cantidad;
  }

  texto += "-".repeat(ANCHO_TOTAL) + "\n";
  texto += `TOTAL:`.padEnd(ANCHO_TOTAL - 8, " ") + `$${total.toFixed(2)}\n`;
  texto += "-".repeat(ANCHO_TOTAL) + "\n";
  texto += `Fecha: ${fecha}\n`;
  texto += centrar("Gracias por su compra!") + "\n\n\n";

  return texto;
}

