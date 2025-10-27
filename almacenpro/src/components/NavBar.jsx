// src/components/NavBar.jsx
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold">AlmacenPro</span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMain"
          aria-controls="navMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <NavLink
                to="/scanner"
                className={({ isActive }) =>
                  "nav-link px-3 py-2 rounded " +
                  (isActive ? "bg-secondary fw-bold" : "")
                }
              >
                Escáner
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/pedidos"
                className={({ isActive }) =>
                  "nav-link px-3 py-2 rounded " +
                  (isActive ? "bg-secondary fw-bold" : "")
                }
              >
                Pedidos
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
