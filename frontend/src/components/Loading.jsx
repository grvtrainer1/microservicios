import "./Loading.css";

function Loading({ texto = "Cargando..." }) {
  return <p className="loading">{texto}</p>;
}

export default Loading;
