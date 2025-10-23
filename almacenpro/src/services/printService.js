// ==============================
//  Servicio de impresión con RawBT
// ==============================

//  Función principal para imprimir un ticket desde RawBT
export function printWithRawBT(ticketTexto) {
  try {
    const encoded = encodeURIComponent(ticketTexto.trim());
    const url = `intent:rawbt?data=${encoded}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end`;

    // ✅ Formulario oculto para ejecutar el intent sin mostrar texto
    const form = document.createElement("form");
    form.action = url;
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  } catch (error) {
    console.error("❌ Error enviando a RawBT:", error);
    alert("Error al imprimir con RawBT");
  }
}





//  Helper: genera texto del ticket a partir del carrito
export function generarTicketTexto(items) {
  const fecha = new Date().toLocaleString("es-UY");

  //  Ancho total estándar para papel de 80 mm → 32 caracteres aprox.
  const ANCHO_TOTAL = 32;

  // Centrar texto
  const centrar = (texto) => {
    const espacios = Math.max(0, Math.floor((ANCHO_TOTAL - texto.length) / 2));
    return " ".repeat(espacios) + texto;
  };

  // Márgenes laterales (para que no imprima tan pegado al borde)
  const margen = (texto) => "   " + texto; // 3 espacios de margen

  let texto = "";
  texto += margen(centrar("KIOSCO PILOTOss")) + "\n";
  texto += margen("-".repeat(ANCHO_TOTAL)) + "\n";
  texto += margen("Producto        Cant   Precio") + "\n";
  texto += margen("-".repeat(ANCHO_TOTAL)) + "\n";

  let total = 0;
  for (const item of items) {
    //  Ajuste de columnas (alineado perfecto)
    const nombre = item.name.slice(0, 14).padEnd(14, " ");
    const cantidad = String(item.cantidad).padStart(4, " ");
    const precio = (item.price * item.cantidad).toFixed(2).padStart(10, " ");
    texto += margen(`${nombre}${cantidad}${precio}`) + "\n";
    total += item.price * item.cantidad;
  }

  texto += margen("-".repeat(ANCHO_TOTAL)) + "\n";

  //  Centrar TOTAL
  const totalTexto = `TOTAL: $${total.toFixed(2)}`;
  texto += margen(centrar(totalTexto)) + "\n";

  texto += margen("-".repeat(ANCHO_TOTAL)) + "\n";
  texto += margen(`Fecha: ${fecha}`) + "\n";
  texto += margen(centrar("Gracias por su compra!")) + "\n\n\n";

  return texto;
}
