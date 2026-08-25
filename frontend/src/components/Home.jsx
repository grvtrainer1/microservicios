import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <section className="home">
      <h1>Biblioteca Online</h1>
      <p>
        Ejemplo docente de arquitectura de microservicios: este Front-End en React
        habla con un <strong>Gateway</strong>, que enruta las peticiones a los
        microservicios <strong>ms-buscador</strong> y <strong>ms-operador</strong>,
        registrados en <strong>Eureka</strong>.
      </p>
      <div className="home__acciones">
        <Link to="/libros" className="boton">Ver catálogo de libros</Link>
        <Link to="/prestamos" className="boton boton--secundario">Ver préstamos</Link>
      </div>
    </section>
  );
}

export default Home;
