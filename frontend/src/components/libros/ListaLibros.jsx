import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { API_BASE_URL } from "../../api/config";
import BuscadorLibros from "./BuscadorLibros";
import LibroCard from "./LibroCard";
import Loading from "../Loading";
import "./ListaLibros.css";

function construirUrl(titulo, autor) {
  const params = new URLSearchParams();
  if (titulo) params.set("titulo", titulo);
  if (autor) params.set("autor", autor);
  const query = params.toString();
  return `${API_BASE_URL}/libros${query ? `?${query}` : ""}`;
}

function ListaLibros() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");

  // Esperamos a que el usuario deje de escribir antes de llamar a ms-buscador:
  // evita disparar una peticion HTTP en cada pulsacion de tecla.
  const tituloDebounced = useDebouncedValue(titulo);
  const autorDebounced = useDebouncedValue(autor);

  const { data: libros, loading, error } = useFetch(construirUrl(tituloDebounced, autorDebounced));

  return (
    <section className="lista-libros">
      <h2>Catálogo de libros</h2>
      <BuscadorLibros
        titulo={titulo}
        autor={autor}
        onTituloChange={setTitulo}
        onAutorChange={setAutor}
      />

      {loading && <Loading texto="Buscando libros…" />}
      {error && <p className="lista-libros__error">{error}</p>}
      {!loading && !error && libros?.length === 0 && <p>No se han encontrado libros.</p>}

      <div className="lista-libros__grid">
        {libros?.map((libro) => (
          <LibroCard key={libro.id} libro={libro} />
        ))}
      </div>
    </section>
  );
}

export default ListaLibros;
