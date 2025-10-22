import { useState, useRef } from "react";
import { obtenerProductoPorCodigo } from "../services/api";

export default function EntradaEscaner({
  inputRef, // 👈 recibe la referencia desde ScannerView
  onProductoEncontrado,
  onProductoNoEncontrado,
}) {
  const [codigo, setCodigo] = useState("");
  const ultimoCodigo = useRef(null);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const codigoTrim = codigo.trim();
    if (!codigoTrim) return;

    // Evitamos doble lectura inmediata (por React o scanner)
    if (ultimoCodigo.current === codigoTrim) return;
    ultimoCodigo.current = codigoTrim;

    try {
      const producto = await obtenerProductoPorCodigo(codigoTrim);
      reproducirBeep(true); // ✅ sonido éxito
      onProductoEncontrado(producto);
    } catch {
      reproducirBeep(false); // ❌ sonido error
      onProductoNoEncontrado(codigoTrim);
    }

    setCodigo("");
    setTimeout(() => (ultimoCodigo.current = null), 300);
  };

  // 🔊 función para reproducir un beep simple (sin archivos externos)
  const reproducirBeep = (exito = true) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = exito ? 880 : 220; // tono alto = éxito, bajo = error
    gain.gain.value = 0.1;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  return (
    <form onSubmit={manejarSubmit} className="d-flex gap-2">
      <input
        ref={inputRef} // 👈 permite que ScannerView maneje el foco
        type="text"
        className="form-control"
        placeholder="Escaneá o escribí el código..."
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        autoFocus
      />
      <button className="btn btn-primary" type="submit">
        📷 Leer
      </button>
    </form>
  );
}
