import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ControlStock() {
    const [stock, setStock] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/api/stock`)
            .then(res => setStock(res.data))
            .catch(err => console.error("Error cargando control stock:", err));
    }, []);

    return (
        <div className="container bg-dark text-light py-4 min-vh-100">
            <h1 className="mb-4 text-center">📊 Control de Stock</h1>

            {stock.length === 0 ? (
                <p>No hay ventas registradas todavía.</p>
            ) : (
                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad Vendida</th>
                            <th>Última Venta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stock.map((p) => (
                            <tr
                                key={p.producto}
                                style={{
                                    backgroundColor:
                                        p.producto.toLowerCase().includes("manual")
                                            ? "rgba(0, 123, 255, 0.3)" // azul clarito
                                            : p.cantidad_vendida > 5
                                                ? "rgba(255,0,0,0.3)"
                                                : p.cantidad_vendida > 3
                                                    ? "rgba(255,255,0,0.3)"
                                                    : "transparent",
                                }}
                            >
                                <td>{p.producto}</td>
                                <td>{p.cantidad_vendida}</td>
                                <td>{new Date(p.ultima_venta).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
