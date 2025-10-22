// ==============================
// 📱 Servicio de impresión con RawBT
// ==============================

// 🧾 Función principal para imprimir un ticket desde RawBT
export function printWithRawBT(ticketTexto) {
  try {
    const encoded = encodeURIComponent(ticketTexto);
    const rawbtUrl = `intent://rawbt?data=${encoded}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end`;
    window.location.href = rawbtUrl; // Abre la app RawBT directamente
  } catch (error) {
    console.error("❌ Error enviando a RawBT:", error);
    alert("Error al imprimir con RawBT");
  }
}

// 🧠 Helper: genera texto del ticket a partir del carrito
export function generarTicketTexto(items) {
  const fecha = new Date().toLocaleString("es-UY");
  let texto = "";
  texto += "    🏪 kIOSCO PILOTO     \n";
  texto += "------------------------------\n";
  texto += "Producto                Precio\n";
  texto += "------------------------------\n";

  let total = 0;
  for (const item of items) {
    const nombre = item.name.slice(0, 18).padEnd(20, " ");
    const precio = (item.price * item.cantidad).toFixed(2).padStart(8, " ");
    texto += `${nombre}${precio}\n`;
    total += item.price * item.cantidad;
  }

  texto += "------------------------------\n";
  texto += `TOTAL:                $${total.toFixed(2)}\n`;
  texto += "------------------------------\n";
  texto += `Fecha: ${fecha}\n`;
  texto += "Gracias por su compra!\n\n\n\n";

  return texto;
}
