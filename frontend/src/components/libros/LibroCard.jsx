import { Link } from "react-router-dom";
import "./LibroCard.css";

function LibroCard({ libro }) {
  return (
    <article className="libro-card">
      <div className="libro-card__cabecera">
        <h3>{libro.titulo}</h3>
        <span className={`libro-card__estado ${libro.disponible ? "disponible" : "prestado"}`}>
          {libro.disponible ? "Disponible" : "Prestado"}
        </span>
      </div>
      <p className="libro-card__autor">{libro.autor} · {libro.anioPublicacion}</p>
      <div className="libro-card__acciones">
        <Link to={`/libros/${libro.id}`}>Ver detalle</Link>
        {libro.disponible && <Link to={`/prestamos/nuevo?libroId=${libro.id}`}>Solicitar préstamo</Link>}
      </div>
    </article>
  );
}

export default LibroCard;
