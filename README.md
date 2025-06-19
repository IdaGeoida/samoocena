# PCF Self-Assessment

## Backend

```bash
# Build containers
docker compose up --build -d
# Run migrations
docker compose exec web alembic upgrade head
```

Swagger UI will be at `http://localhost:8000/docs`.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The React app will be available at `http://localhost:5173`.
All requests to `/api` will be proxied to the backend running on
`http://localhost:8000`, so make sure the backend is running when using the
development server.
