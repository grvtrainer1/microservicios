import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { API_BASE_URL } from "../../api/config";
import SelectorLibro from "./SelectorLibro";
import "./NuevoPrestamoForm.css";

function NuevoPrestamoForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Si venimos de "Solicitar préstamo" en una tarjeta del catálogo, el libro
  // ya viene indicado por id: lo cargamos para preseleccionarlo en el buscador.
  const libroIdInicial = searchParams.get("libroId");
  const { data: libroPrecargado } = useFetch(
    libroIdInicial ? `${API_BASE_URL}/libros/${libroIdInicial}` : null
  );

  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [usuario, setUsuario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Solo preseleccionamos si sigue disponible: pudo prestarse entre medias.
    if (libroPrecargado?.disponible) {
      setLibroSeleccionado(libroPrecargado);
    }
  }, [libroPrecargado]);

  const puedeEnviar = !!libroSeleccionado && usuario.trim().length > 0 && !enviando;

  async function handleSubmit(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);

    const respuesta = await fetch(`${API_BASE_URL}/prestamos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ libroId: libroSeleccionado.id, usuario }),
    });

    setEnviando(false);

    if (!respuesta.ok) {
      const mensaje = await respuesta.text();
      setError(mensaje || "No se ha podido crear el préstamo.");
      // El libro pudo prestarse justo antes que nosotros: forzamos a elegir de nuevo.
      setLibroSeleccionado(null);
      return;
    }

    navigate("/prestamos");
  }

  return (
    <section className="nuevo-prestamo">
      <h2>Nuevo préstamo</h2>

      {libroPrecargado && !libroPrecargado.disponible && !libroSeleccionado && (
        <p className="nuevo-prestamo__aviso">
          «{libroPrecargado.titulo}» ya está prestado. Busca otro libro disponible.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Libro
          <SelectorLibro libroSeleccionado={libroSeleccionado} onSeleccionar={setLibroSeleccionado} />
        </label>

        <label>
          Usuario
          <input
            type="text"
            required
            placeholder="Tu nombre"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </label>

        {error && <p className="nuevo-prestamo__error">{error}</p>}

        <button type="submit" disabled={!puedeEnviar}>
          {enviando ? "Guardando…" : "Solicitar préstamo"}
        </button>
      </form>
    </section>
  );
}

export default NuevoPrestamoForm;
