# Biblioteca Online — Demo de arquitectura de microservicios

**Autor:** Mgr. Gustavo Rojas Valdivia

Proyecto docente mínimo para explicar cómo encajan React, un Gateway, Eureka
y varios microservicios Spring Boot. La temática (una biblioteca online) es
una excusa: lo importante es la arquitectura.

## Arquitectura

```
        React (frontend, :5173)
                 │  HTTP
                 ▼
        Gateway (Spring Cloud Gateway, :8080)
                 │  se registra y descubre servicios en...
                 ▼
        Eureka (servidor de registro, :8761)
                 ▲                    ▲
                 │ se registran       │
     ms-operador (:8081) ── HTTP sin IP/puerto, por nombre Eureka ──► ms-buscador (:8082)
     (préstamos, H2)                                                 (catálogo de libros, H2)
```

- **eureka-server**: servidor de registro. Todos los demás servicios se dan de alta aquí.
- **gateway**: único punto de entrada para el Front-End. Enruta `/api/libros/**` → `ms-buscador`
  y `/api/prestamos/**` → `ms-operador`, resolviendo la instancia real a través de Eureka (`lb://`).
- **ms-buscador**: expone el catálogo de libros (`GET /libros`, con filtros `titulo`/`autor`/`anio`)
  usando una base de datos en memoria H2.
- **ms-operador**: gestiona préstamos (`GET/POST /prestamos`, `PUT /prestamos/{id}` para devolver).
  Antes de crear un préstamo, llama a `ms-buscador` **por su nombre de registro en Eureka**
  (`http://ms-buscador/libros/{id}`), nunca por IP:puerto — así se demuestra el valor real
  de Eureka + balanceo de carga en microservicios.
- **frontend**: aplicación React (componentes funcionales, hooks, React Router) que solo habla
  con el Gateway, nunca directamente con los microservicios.

## Cómo ejecutarlo

Requisitos: Java 17+, Maven, Node.js 18+.

Arrancar en este orden (cada uno en su propia terminal):

```bash
# 1. Registro de servicios
cd eureka-server && mvn spring-boot:run

# 2. Microservicios (pueden arrancar en cualquier orden entre sí, pero después de Eureka)
cd ms-buscador && mvn spring-boot:run
cd ms-operador && mvn spring-boot:run

# 3. Gateway (después de que los microservicios estén registrados)
cd gateway && mvn spring-boot:run

# 4. Frontend
cd frontend
npm install
npm start
```

- Panel de Eureka: http://localhost:8761
- Front-End: http://localhost:5173
- Gateway (API): http://localhost:8080/api

## Para ver la arquitectura "en vivo" en clase

1. Abrir http://localhost:8761 y mostrar cómo `MS-BUSCADOR`, `MS-OPERADOR` y `GATEWAY`
   aparecen registrados.
2. Crear un préstamo desde el Front-End y enseñar en los logs de `ms-operador` que la
   petición a `ms-buscador` se resuelve por nombre, sin IP fija.
3. Parar y volver a arrancar `ms-buscador` con otro puerto libre para mostrar que Eureka
   y el balanceador siguen encontrando la instancia sin tocar código.
