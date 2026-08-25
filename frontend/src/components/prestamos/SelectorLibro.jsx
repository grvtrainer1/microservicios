import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { API_BASE_URL } from "../../api/config";
import "./SelectorLibro.css";

// Buscador tipo "autocompletar": el usuario escribe el titulo del libro
// y elige uno de los resultados, sin necesidad de conocer ningun id.
// Solo se ofrecen libros disponibles: uno ya prestado no puede prestarse de nuevo.
function SelectorLibro({ libroSeleccionado, onSeleccionar }) {
  const [texto, setTexto] = useState("");
  const textoDebounced = useDebouncedValue(texto);

  const urlBusqueda =
    !libroSeleccionado && textoDebounced.trim()
      ? `${API_BASE_URL}/libros?titulo=${encodeURIComponent(textoDebounced.trim())}&disponible=true`
      : null;

  const { data: resultados, loading } = useFetch(urlBusqueda);

  if (libroSeleccionado) {
    return (
      <div className="selector-libro">
        <div className="selector-libro__elegido">
          <span>{libroSeleccionado.titulo} — {libroSeleccionado.autor}</span>
          <button type="button" onClick={() => onSeleccionar(null)}>
            Cambiar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="selector-libro">
      <input
        type="text"
        placeholder="Escribe el título del libro…"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      {textoDebounced.trim() && (
        <ul className="selector-libro__resultados">
          {loading && <li className="selector-libro__mensaje">Buscando…</li>}
          {!loading && resultados?.length === 0 && (
            <li className="selector-libro__mensaje">Sin resultados disponibles.</li>
          )}
          {!loading &&
            resultados?.map((libro) => (
              <li key={libro.id}>
                <button type="button" onClick={() => onSeleccionar(libro)}>
                  {libro.titulo} — {libro.autor}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default SelectorLibro;
