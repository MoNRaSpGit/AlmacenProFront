import ListaProductos from "../components/ListaProductos";

export default function Inicio() {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Consulta de precios</h1>
      <p className="text-center">Mostrando los primeros 5 productos:</p>
      <ListaProductos />
    </div>
  );
}
