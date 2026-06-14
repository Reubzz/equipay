# Backend (Spring Boot)

Run the application and Postgres locally with Docker Compose:

```bash
docker compose up --build
```

- Application: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui/index.html (or /swagger-ui.html)

Flyway will run migrations on startup. To remove data:

```bash
docker compose down -v
```
