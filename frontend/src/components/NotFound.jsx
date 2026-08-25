import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found">
      <h2>404 — Página no encontrada</h2>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}

export default NotFound;
