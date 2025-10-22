import { useState, useRef } from "react";
import { obtenerProductoPorCodigo } from "../services/api";

export default function EntradaEscaner({
  inputRef,
  onProductoEncontrado,
  onProductoNoEncontrado,
}) {
  const [codigo, setCodigo] = useState("");
  const ultimoCodigo = useRef(null);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const codigoTrim = codigo.trim();
    if (!codigoTrim) return;

    // Evitamos doble lectura inmediata
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

  // 🔊 Beep de éxito o error
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
        className="form-control form-control-lg"
        placeholder="Escaneá o escribí el código..."
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        autoFocus
        inputMode="none" // 🚫 evita que se abra teclado
        onFocus={(e) => {
          // 🧠 Truco para evitar teclado en tablets Android
          e.target.setAttribute("readonly", "readonly");
          setTimeout(() => {
            e.target.removeAttribute("readonly");
          }, 100);
        }}
      />
      <button className="btn btn-primary btn-lg px-4" type="submit">
        📷 Leer
      </button>
    </form>
  );
}
