import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import ListaLibros from "./components/libros/ListaLibros";
import DetalleLibro from "./components/libros/DetalleLibro";
import ListaPrestamos from "./components/prestamos/ListaPrestamos";
import NuevoPrestamoForm from "./components/prestamos/NuevoPrestamoForm";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="app__contenido">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/libros" element={<ListaLibros />} />
          <Route path="/libros/:id" element={<DetalleLibro />} />
          <Route path="/prestamos" element={<ListaPrestamos />} />
          <Route path="/prestamos/nuevo" element={<NuevoPrestamoForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
