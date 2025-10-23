// ==============================
// 📱 Test básico de impresión RawBT
// ==============================

export function printWithRawBT(ticketTexto) {
  try {
    const encoded = encodeURIComponent(ticketTexto);
    const rawbtUrl = `intent:rawbt?data=${encoded}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end`;
    window.open(rawbtUrl, "_self"); // simple
  } catch (error) {
    console.error("❌ Error RawBT:", error);
    alert("Error al imprimir");
  }
}

// ==============================
// 🧾 Ticket súper simple (sin formato)
// ==============================

export function generarTicketTexto(items) {
  let texto = "KIOSCO PILOTO\n";
  texto += "-------------------\n";
  let total = 0;

  for (const i of items) {
    const linea = `${i.name} x${i.cantidad} = $${i.price * i.cantidad}\n`;
    texto += linea;
    total += i.price * i.cantidad;
  }

  texto += "-------------------\n";
  texto += `TOTAL: $${total.toFixed(2)}\n`;
  texto += "Gracias por su compra!\n\n\n";
  return texto;
}
