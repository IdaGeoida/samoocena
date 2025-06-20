# PCF Self-Assessment

## Backend

```bash
# Build containers and start the stack
docker compose up --build -d
# Run migrations
docker compose exec web alembic upgrade head
```

The backend logs can be followed with:

```bash
docker compose logs -f web
```

If you need to start with a completely empty database:

```bash
docker compose down -v
```

**Warning:** the above command removes the `db_data` volume and will erase all
persisted data.

During startup the application loads initial data from `app/initial_data.yml`.
You can override the path with the `INITIAL_DATA_PATH` environment variable or
set `SKIP_INIT_DATA=1` to skip loading entirely.

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

## Testing

```bash
pytest
```
