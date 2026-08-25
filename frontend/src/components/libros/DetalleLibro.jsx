import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { API_BASE_URL } from "../../api/config";
import Loading from "../Loading";
import "./DetalleLibro.css";

function DetalleLibro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: libro, loading, error } = useFetch(`${API_BASE_URL}/libros/${id}`);

  if (loading) return <Loading texto="Cargando libro…" />;
  if (error) return <p className="detalle-libro__error">{error}</p>;
  if (!libro) return null;

  return (
    <section className="detalle-libro">
      <div className="detalle-libro__cabecera">
        <h2>{libro.titulo}</h2>
        <span className={`detalle-libro__estado ${libro.disponible ? "disponible" : "prestado"}`}>
          {libro.disponible ? "Disponible" : "Prestado"}
        </span>
      </div>
      <p className="detalle-libro__meta">{libro.autor} · {libro.anioPublicacion} · ISBN {libro.isbn}</p>
      <p>{libro.sinopsis}</p>
      <div className="detalle-libro__acciones">
        <button
          disabled={!libro.disponible}
          onClick={() => navigate(`/prestamos/nuevo?libroId=${libro.id}`)}
        >
          {libro.disponible ? "Solicitar préstamo" : "No disponible"}
        </button>
        <button className="secundario" onClick={() => navigate(-1)}>Volver</button>
      </div>
    </section>
  );
}

export default DetalleLibro;
