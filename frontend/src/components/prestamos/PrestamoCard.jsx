import { useState } from "react";
import { API_BASE_URL } from "../../api/config";
import "./PrestamoCard.css";

function PrestamoCard({ prestamo, onCambio }) {
  const [enviando, setEnviando] = useState(false);

  async function devolver() {
    setEnviando(true);
    await fetch(`${API_BASE_URL}/prestamos/${prestamo.id}`, { method: "PUT" });
    setEnviando(false);
    onCambio();
  }

  return (
    <article className="prestamo-card">
      <div>
        <h3>{prestamo.tituloLibro}</h3>
        <p className="prestamo-card__meta">
          Usuario: {prestamo.usuario} · Prestado el {prestamo.fechaPrestamo}
        </p>
      </div>
      <span className={`prestamo-card__estado prestamo-card__estado--${prestamo.estado.toLowerCase()}`}>
        {prestamo.estado}
      </span>
      {prestamo.estado === "ACTIVO" && (
        <button disabled={enviando} onClick={devolver}>
          {enviando ? "Guardando…" : "Devolver"}
        </button>
      )}
    </article>
  );
}

export default PrestamoCard;
