export default function TarjetaProducto({ producto }) {
  if (!producto) {
    return (
      <p className="mt-3 text-center text-muted">
        Escanee un producto para verlo aquí
      </p>
    );
  }

  return (
    <div className="card bg-secondary text-light shadow-lg">
      {producto.image && (
        <img
          src={producto.image}
          className="card-img-top"
          alt={producto.name}
          style={{ maxHeight: "200px", objectFit: "contain" }}
        />
      )}

      <div className="card-body text-center">
        <h4 className="card-title">{producto.name}</h4>
        <p className="card-text fs-5">Precio: ${producto.price}</p>
      </div>
    </div>
  );
}
