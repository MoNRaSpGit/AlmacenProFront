// ==============================
// 📱 Servicio de impresión con RawBT
// ==============================

// 🧾 Enviar ticket a la app RawBT
export function printWithRawBT(ticketTexto) {
  try {
    const encoded = encodeURIComponent(ticketTexto);
    const rawbtUrl = `intent://rawbt?data=${encoded}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end`;
    window.location.href = rawbtUrl; // abre RawBT
  } catch (error) {
    console.error("❌ Error enviando a RawBT:", error);
    alert("Error al imprimir con RawBT");
  }
}

// 🧠 Generar texto del ticket con formato centrado y columna Cantidad
export function generarTicketTexto(items) {
  const fecha = new Date().toLocaleString("es-UY");

  // helper para centrar texto
  const centrar = (texto) => {
    const ancho = 32; // ancho estándar para 80mm
    const espacios = Math.max(0, Math.floor((ancho - texto.length) / 2));
    return " ".repeat(espacios) + texto + "\n";
  };

  let texto = "";
  texto += centrar("🏪 KIOSCO PILOTO 🏪");
  texto += "--------------------------------\n";
  texto += "Producto        Cant  Precio\n";
  texto += "--------------------------------\n";

  let total = 0;
  for (const item of items) {
    const nombre = item.name.slice(0, 14).padEnd(15, " ");
    const cantidad = String(item.cantidad || 1).padStart(4, " ");
    const subtotal = (item.price * item.cantidad).toFixed(2).padStart(8, " ");
    texto += `${nombre}${cantidad}${subtotal}\n`;
    total += item.price * item.cantidad;
  }

  texto += "--------------------------------\n";
  texto += `TOTAL:                 $${total.toFixed(2)}\n`;
  texto += "--------------------------------\n";
  texto += `Fecha: ${fecha}\n\n`;
  texto += centrar("¡Gracias por su compra!");
  texto += "\n\n\n"; // espacio final para corte

  return texto;
}
