import { useState, useRef } from "react";
import { obtenerProductoPorCodigo } from "../services/api";

export default function EntradaEscaner({ onProductoEncontrado, onProductoNoEncontrado }) {
  const [codigo, setCodigo] = useState("");
  const ultimoCodigo = useRef(null); // 👈 guardamos el último código leído

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const codigoTrim = codigo.trim();
    if (!codigoTrim) return;

    // Evitamos doble lectura inmediata (por React o scanner)
    if (ultimoCodigo.current === codigoTrim) return;
    ultimoCodigo.current = codigoTrim;

    try {
      const producto = await obtenerProductoPorCodigo(codigoTrim);
      onProductoEncontrado(producto);
    } catch {
      onProductoNoEncontrado(codigoTrim);
    }

    setCodigo("");
    setTimeout(() => (ultimoCodigo.current = null), 300); // 👈 libera tras un breve delay
  };

  return (
    <form onSubmit={manejarSubmit} className="d-flex gap-2">
      <input
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
