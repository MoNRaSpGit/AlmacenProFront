import { useEffect } from "react";

export default function Notificacion({ mensaje, tipo = "exito", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500); // ⏱️ se cierra solo en 2.5 s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`position-fixed top-0 start-50 translate-middle-x mt-4 alert alert-${
        tipo === "error" ? "danger" : "success"
      } shadow`}
      style={{ zIndex: 2000, minWidth: "280px", textAlign: "center" }}
    >
      {mensaje}
    </div>
  );
}
