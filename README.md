# Task Management Service (In-memory)

Lightweight Node.js microservice demonstrating authentication and task management using in-memory storage for testing and demo purposes.

Run locally

```bash
cp .env.example .env
npm install
npm run dev
```

Run tests

```bash
npm test
```

Run with Docker

```bash
docker build -t task-service .
docker run -p 3000:3000 --env-file .env task-service
```

Example curl

Register:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"Secret123"}'
```

Login:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"Secret123"}'
```
# task-managment-service
Production-grade Task Management microservice using Node.js.
