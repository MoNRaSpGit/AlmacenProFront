// src/components/EntradaEscaner.jsx
import { useState } from "react";
import { obtenerProductoPorCodigo } from "../services/api";

export default function EntradaEscaner({ onProductoEncontrado, onProductoNoEncontrado }) {
  const [codigo, setCodigo] = useState("");

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!codigo.trim()) return;

    try {
      const producto = await obtenerProductoPorCodigo(codigo.trim());
      onProductoEncontrado(producto);
    } catch {
      // 🔥 antes acá estaba el alert, lo quitamos
      onProductoNoEncontrado(codigo.trim());
    }

    setCodigo("");
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
