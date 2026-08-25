package com.unir.operador.service;

import com.unir.operador.dto.DisponibilidadRequest;
import com.unir.operador.dto.LibroDto;
import com.unir.operador.dto.NuevoPrestamoRequest;
import com.unir.operador.model.Prestamo;
import com.unir.operador.repository.PrestamoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class PrestamoService {

    // "ms-buscador" es el nombre con el que ese microservicio se registra en Eureka.
    // No usamos IP ni puerto: el LoadBalancer los resuelve a partir del registro.
    private static final String URL_LIBRO = "http://ms-buscador/libros/{id}";
    private static final String URL_DISPONIBILIDAD = "http://ms-buscador/libros/{id}/disponibilidad";

    private final PrestamoRepository prestamoRepository;
    private final RestTemplate restTemplate;

    public PrestamoService(PrestamoRepository prestamoRepository, RestTemplate restTemplate) {
        this.prestamoRepository = prestamoRepository;
        this.restTemplate = restTemplate;
    }

    public List<Prestamo> listar() {
        return prestamoRepository.findAll();
    }

    public Optional<Prestamo> obtener(Long id) {
        return prestamoRepository.findById(id);
    }

    public Prestamo crear(NuevoPrestamoRequest request) {
        // Antes de crear el prestamo, se valida el libro contra el microservicio Buscador.
        LibroDto libro = obtenerLibro(request.getLibroId());

        if (!libro.isDisponible()) {
            throw new IllegalStateException("El libro '" + libro.getTitulo() + "' ya está prestado");
        }

        Prestamo prestamo = new Prestamo();
        prestamo.setLibroId(libro.getId());
        prestamo.setTituloLibro(libro.getTitulo());
        prestamo.setUsuario(request.getUsuario());
        prestamo.setFechaPrestamo(LocalDate.now());
        prestamo.setEstado("ACTIVO");

        Prestamo guardado = prestamoRepository.save(prestamo);

        // Se marca el libro como no disponible solo despues de guardar el prestamo,
        // para no dejarlo bloqueado si el guardado fallase.
        actualizarDisponibilidad(libro.getId(), false);

        return guardado;
    }

    public Prestamo devolver(Long id) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Prestamo no encontrado: " + id));
        prestamo.setEstado("DEVUELTO");
        prestamo.setFechaDevolucion(LocalDate.now());
        Prestamo guardado = prestamoRepository.save(prestamo);

        actualizarDisponibilidad(prestamo.getLibroId(), true);

        return guardado;
    }

    private LibroDto obtenerLibro(Long libroId) {
        try {
            return restTemplate.getForObject(URL_LIBRO, LibroDto.class, libroId);
        } catch (HttpClientErrorException.NotFound ex) {
            throw new NoSuchElementException("El libro " + libroId + " no existe en el catalogo");
        }
    }

    private void actualizarDisponibilidad(Long libroId, boolean disponible) {
        restTemplate.put(URL_DISPONIBILIDAD, new DisponibilidadRequest(disponible), libroId);
    }
}
