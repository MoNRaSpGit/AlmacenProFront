import { useState } from "react";

export default function TarjetaIngresarProducto({ codigo, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  const manejarGuardar = () => {
    if (!precio) {
      alert("Debe ingresar un precio");
      return;
    }
    onGuardar({
      nombre: nombre.trim() === "" ? "Producto?" : nombre,
      precio: Number(precio),
      codigo,
    });
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        zIndex: 2000,
      }}
    >
      <div
        className="card bg-dark text-light p-4 shadow-lg"
        style={{ width: "90%", maxWidth: "400px" }}
      >
        <h4 className="text-center mb-3">⚠️ Producto no encontrado</h4>
        <p className="text-center text-warning">
          Código: <strong>{codigo}</strong>
        </p>

        <label className="form-label mt-2">Nombre (opcional):</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Ej: Shampoo Neves"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label className="form-label">💰 Precio *</label>
        <input
          type="number"
          className="form-control mb-4"
          placeholder="Ej: 120.00"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />

        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary w-45" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="btn btn-success w-45" onClick={manejarGuardar}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
