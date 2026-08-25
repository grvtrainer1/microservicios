import { NavLink } from "react-router-dom";
import "./Header.css";

// Usamos NavLink (React Router) en lugar de <a href>, para no forzar
// un recargado completo de la pagina al navegar.
function Header() {
  return (
    <header className="header">
      <div className="header__brand">📚 Biblioteca UNIR</div>
      <nav className="header__nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Inicio
        </NavLink>
        <NavLink to="/libros" className={({ isActive }) => (isActive ? "active" : "")}>
          Catálogo
        </NavLink>
        <NavLink to="/prestamos" className={({ isActive }) => (isActive ? "active" : "")}>
          Préstamos
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
