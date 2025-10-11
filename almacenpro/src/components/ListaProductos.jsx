import { useEffect, useState } from "react";
import { obtenerProductos } from "../services/api.js";

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerProductos();
        setProductos(data.slice(0, 5)); // solo 5 primeros
      } catch (err) {
        console.error("Error cargando productos:", err.message);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div className="row mt-4">
      {productos.length === 0 ? (
        <p>No hay productos cargados</p>
      ) : (
        productos.map((p) => (
          <div className="col-md-4 mb-3" key={p.id}>
            <div className="card h-100 shadow-sm">
              {p.image_url && (
                <img
                  src={p.image_url}
                  className="card-img-top"
                  alt={p.name}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">Precio: ${p.price}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
