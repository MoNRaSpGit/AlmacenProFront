import { useState, useRef } from "react";
import { obtenerProductoPorCodigo } from "../services/api";

export default function EntradaEscaner({
  inputRef, // 👈 referencia del ScannerView
  onProductoEncontrado,
  onProductoNoEncontrado,
}) {
  const [codigo, setCodigo] = useState("");
  const ultimoCodigo = useRef(null);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const codigoTrim = codigo.trim();
    if (!codigoTrim) return;

    // Evita doble lectura inmediata
    if (ultimoCodigo.current === codigoTrim) return;
    ultimoCodigo.current = codigoTrim;

    try {
      const producto = await obtenerProductoPorCodigo(codigoTrim);
      reproducirBeep(true);
      onProductoEncontrado(producto);
    } catch {
      reproducirBeep(false);
      onProductoNoEncontrado(codigoTrim);
    }

    setCodigo("");
    setTimeout(() => (ultimoCodigo.current = null), 300);
  };

  // 🔊 beep simple de éxito/error
  const reproducirBeep = (exito = true) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = exito ? 880 : 220;
    gain.gain.value = 0.1;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  return (
    <form onSubmit={manejarSubmit} className="d-flex gap-2">
      <input
        ref={inputRef}
        type="text"
        className="form-control"
        placeholder="Escaneá o escribí el código..."
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        autoFocus
        inputMode="none" // 🚫 evita que el teclado se abra en tablets
        onFocus={(e) => {
          // 🧠 Truco: bloquear teclado momentáneamente
          e.target.setAttribute("readonly", "readonly");
          setTimeout(() => e.target.removeAttribute("readonly"), 100);
        }}
      />
      <button className="btn btn-primary" type="submit">
        📷 Leer
      </button>
    </form>
  );
}
