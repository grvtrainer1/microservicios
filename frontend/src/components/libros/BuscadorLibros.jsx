import "./BuscadorLibros.css";

// Componente controlado por el padre (ListaLibros): no gestiona su propio
// estado, solo muestra los valores actuales y notifica cada cambio.
// La busqueda se dispara sola mientras el usuario escribe (con debounce).
function BuscadorLibros({ titulo, autor, onTituloChange, onAutorChange }) {
  return (
    <div className="buscador-libros">
      <input
        type="text"
        placeholder="Buscar por título…"
        value={titulo}
        onChange={(e) => onTituloChange(e.target.value)}
      />
      <input
        type="text"
        placeholder="Buscar por autor…"
        value={autor}
        onChange={(e) => onAutorChange(e.target.value)}
      />
    </div>
  );
}

export default BuscadorLibros;
