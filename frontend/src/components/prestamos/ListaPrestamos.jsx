import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { API_BASE_URL } from "../../api/config";
import PrestamoCard from "./PrestamoCard";
import Loading from "../Loading";
import "./ListaPrestamos.css";

function ListaPrestamos() {
  const { data: prestamos, loading, error, refetch } = useFetch(`${API_BASE_URL}/prestamos`);

  return (
    <section className="lista-prestamos">
      <div className="lista-prestamos__cabecera">
        <h2>Préstamos</h2>
        <Link to="/prestamos/nuevo" className="boton">Nuevo préstamo</Link>
      </div>

      {loading && <Loading texto="Cargando préstamos…" />}
      {error && <p className="lista-prestamos__error">{error}</p>}
      {!loading && !error && prestamos?.length === 0 && <p>Todavía no hay préstamos registrados.</p>}

      {prestamos?.map((prestamo) => (
        <PrestamoCard key={prestamo.id} prestamo={prestamo} onCambio={refetch} />
      ))}
    </section>
  );
}

export default ListaPrestamos;
