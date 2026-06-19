# Job Application Tracker

A full-stack job application tracker for recording companies, roles, job types, application status, applied dates, and notes. The app includes a React dashboard for adding, editing, searching, updating status, and deleting job applications, backed by an Express API and PostgreSQL database.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- shadcn-style UI components
- Lucide React icons

### Backend

- Node.js
- Express 5
- Sequelize ORM
- PostgreSQL
- dotenv
- cors

### Tooling

- Docker Compose for PostgreSQL/backend container setup
- ESLint for the client

## Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL, either installed locally or running with Docker
- Docker and Docker Compose, optional

## Installation

Install backend/root dependencies:

```bash
npm install
```

Install client dependencies:

```bash
npm install --prefix src/client
```

Create environment files from the examples:

```bash
cp .env.example .env
cp src/client/.env.example src/client/.env
```

## Environment Variables

### Server

The server uses `PORT` from the environment. The database connection in `src/server/models/db.js` is currently hardcoded to:

- database: `postgres`
- username: `postgres`
- password: `password`
- host: `localhost`
- dialect: `postgres`

Recommended server variables are included in `.env.example` so the database config can be made environment-driven:

| Variable | Example | Description |
| --- | --- | --- |
| `PORT` | `3000` | Express server port |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_USER` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `password` | PostgreSQL password |
| `DB_NAME` | `postgres` | PostgreSQL database name |
| `DB_PORT` | `5432` | PostgreSQL port |

### Client

| Variable | Example | Description |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000` | Backend API base URL used by Axios |

## .env.example

Root `.env.example`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=postgres
DB_PORT=5432
```

Client `src/client/.env.example`:

```env
VITE_API_URL=http://localhost:3000
```

## Run in Development

### 1. Start PostgreSQL

If you already have PostgreSQL installed locally, make sure it matches the current connection values in `src/server/models/db.js`.

You can also start the database with Docker Compose:

```bash
docker compose -f src/server/docker-compose.yml up db
```

The Compose database uses:

- host from your machine: `localhost`
- port from your machine: `5433`
- container port: `5432`
- username: `postgres`
- password: `password`
- database: `job_tracker`

Note: the current server database file is hardcoded for `localhost:5432` and database `postgres`, so update `src/server/models/db.js` if you want the server to connect to the Compose database as configured.

### 2. Start the Backend

From the project root:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:3000
```

### 3. Start the Frontend

In a second terminal:

```bash
npm run dev --prefix src/client
```

The Vite dev server usually runs at:

```text
http://localhost:5173
```

## Docker

The repository includes `src/server/docker-compose.yml` for PostgreSQL and the backend.

```bash
docker compose -f src/server/docker-compose.yml up --build
```

On case-sensitive systems, make sure the Dockerfile path in `src/server/docker-compose.yml` matches the actual file name `src/server/dockerfile`, or rename it to `Dockerfile`.

## Tests

There is no automated test suite included yet.

The root `npm test` script is currently a placeholder and exits with an error:

```bash
npm test
```

You can run the client linter:

```bash
npm run lint --prefix src/client
```

## API Docs

API base URL:

```text
http://localhost:3000/api
```

### Health Check

```http
GET /
```

Full URL:

```text
http://localhost:3000/
```

Returns:

```text
Hello TypeScript + Express!
```

### Get Jobs

```http
GET /api/getJobs?page=1&limit=10
```

Query parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `page` | number | No | Page number. Defaults to `1` |
| `limit` | number | No | Items per page. Defaults to `10` |

Example response:

```json
{
  "message": "All Jobs fetched successfully",
  "jobs": []
}
```

### Add Job

```http
POST /api/addjob
```

Alias:

```http
POST /api/addJob
```

Request body:

```json
{
  "companyName": "Acme Inc",
  "jobTitle": "Frontend Developer",
  "jobType": "Full-time",
  "status": "Applied",
  "appliedDate": "2026-06-19",
  "notes": "Applied through company website"
}
```

Required fields:

- `companyName`
- `jobTitle`
- `jobType`
- `status`

Allowed `jobType` values:

- `Full-time`
- `Part-time`
- `Internship`

Allowed `status` values:

- `Applied`
- `Interviewing`
- `Offered`
- `Rejected`

Example response:

```json
{
  "message": "Job added successfully",
  "job": {
    "id": 1,
    "companyName": "Acme Inc",
    "jobTitle": "Frontend Developer",
    "jobType": "Full-time",
    "status": "Applied",
    "appliedDate": "2026-06-19T00:00:00.000Z",
    "notes": "Applied through company website"
  }
}
```

### Update Job

```http
PUT /api/updatedJob/:id
```

Example:

```http
PUT /api/updatedJob/1
```

Request body can include any editable fields:

```json
{
  "companyName": "Acme Inc",
  "jobTitle": "Frontend Developer",
  "jobType": "Full-time",
  "status": "Interviewing",
  "appliedDate": "2026-06-19",
  "notes": "Recruiter screen scheduled"
}
```

Example response:

```json
{
  "message": "Job updated successfully",
  "updateJob": 1
}
```

### Delete Job

```http
DELETE /api/deleteJob/:id
```

Example:

```http
DELETE /api/deleteJob/1
```

Example response:

```json
{
  "message": "Job deleted successfully",
  "deleteJob": 1
}
```

### Filter Jobs by Status

```http
GET /api/filterByStatus?status=Applied&page=1&limit=10
```

Query parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | string | Yes | One of `Applied`, `Interviewing`, `Offered`, `Rejected` |
| `page` | number | No | Page number. Defaults to `1` |
| `limit` | number | No | Items per page. Defaults to `10` |

### Search Jobs

```http
GET /api/searchBy?term=frontend&page=1&limit=10
```

Query parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `term` | string | No | Searches company name, job title, and notes |
| `companyName` | string | No | Searches by company name |
| `jobTitle` | string | No | Searches by job title |
| `jobType` | string | No | Filters by job type |
| `page` | number | No | Page number. Defaults to `1` |
| `limit` | number | No | Items per page. Defaults to `10` |

Example response:

```json
{
  "message": "Search completed successfully",
  "searchResults": [],
  "total": 0,
  "totalPages": 0,
  "currentPage": 1
}
```

## Project Structure

```text
.
├── package.json
├── src
│   ├── client
│   │   ├── src
│   │   │   ├── components
│   │   │   ├── pages
│   │   │   └── App.tsx
│   │   └── package.json
│   └── server
│       ├── controller
│       ├── models
│       ├── routes
│       ├── docker-compose.yml
│       └── index.js
```
