# PulseDesk - Multi-Tenant Enterprise Helpdesk Platform

Welcome to **PulseDesk**, a complete multi-tenant support ticketing and helpdesk application.

---

## 1. Requirements

Before starting, ensure your host environment has the following installed:

* **Docker Engine** (v20.10+ or higher)
* **Docker Compose** (v2.0+ or higher)
* **Git**

No local installations of PHP, Composer, Node.js, or MySQL are required on your host system.

---

## 2. Local Development

For quick local evaluation or development:

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd pulsedesk
   ```

2. **Launch the stack using Docker Compose:**
   ```bash
   docker compose up -d --build
   ```

3. **Open your browser:**
   Navigate to `http://localhost` to access the application.

---

## 3. Production Deployment

PulseDesk is designed for automated one-command production deployments (including cloud platforms like Zeabur, AWS, DigitalOcean, or Linux VPS).

### One-Command Startup
To deploy in a production environment:

```bash
docker compose up -d --build
```

### What Happens Automatically
* **Database Setup**: Spins up a dedicated MySQL 8 container with persistent storage volumes.
* **Database Migrations & Seeding**: Automatically waits for database readiness, runs database schema migrations, and seeds initial demo data.
* **Optimization**: Warms and caches Laravel configuration, API routes, and views for optimal performance.
* **Reverse Proxy**: Nginx automatically proxies API calls (`/api`), serves static uploaded media (`/storage`), and serves the compiled React application on port `80`.

---

## 4. Docker Deployment

The application stack is defined in `docker-compose.yml` and consists of three containerized services connected over an isolated internal network (`pulsedesk-net`):

| Service | Container Name | Description | Exposed Port |
|---|---|---|---|
| **Frontend & Nginx** | `pulsedesk-frontend` | Serves static React production assets and acts as Reverse Proxy for API & Storage | `80:80` |
| **Laravel Backend** | `pulsedesk-backend` | PHP 8.2-FPM application server handling API business logic | Internal (`9000`) |
| **Database** | `pulsedesk-db` | MySQL 8.0 database engine with persistent named volume | Internal (`3306`) |

### Standard Docker Commands

* **Start application**: `docker compose up -d --build`
* **Stop application**: `docker compose down`
* **View running container health**: `docker compose ps`
* **View container logs**: `docker compose logs -f`

---

## 5. Environment Variables

All services support zero-configuration defaults out-of-the-box. If custom settings are required, copy `.env.example` files to `.env` in the respective directories.

### Backend (`backend/.env.example`)

| Variable | Description | Default Value |
|---|---|---|
| `APP_NAME` | Name of the application | `PulseDesk` |
| `APP_ENV` | Environment stage | `production` |
| `APP_KEY` | Application encryption key | Pre-generated default |
| `APP_DEBUG` | Enable debug logging | `false` |
| `APP_URL` | Base application URL | `http://localhost` |
| `DB_CONNECTION` | Database driver | `mysql` |
| `DB_HOST` | Database host container name | `db` |
| `DB_PORT` | Database connection port | `3306` |
| `DB_DATABASE` | MySQL database name | `pulsedesk` |
| `DB_USERNAME` | MySQL user name | `pulsedesk_user` |
| `DB_PASSWORD` | MySQL password | `pulsedesk_password` |
| `SANCTUM_STATEFUL_DOMAINS` | Allowed stateful domains for authentication | `localhost,127.0.0.1` |

### Frontend (`frontend/.env.example`)

| Variable | Description | Default Value |
|---|---|---|
| `VITE_APP_TITLE` | Application Title | `PulseDesk` |
| `VITE_API_BASE_URL` | Relative API URL route | `/api/v1` |

---

## 6. Troubleshooting

### Container Health Check Pending
If containers take longer than expected to become healthy:
* Check container initialization logs: `docker compose logs -f backend`
* Verify database connection readiness. The backend automatically retries database connection until MySQL completes initialization.

### Port 80 Already in Use
If port `80` is in use by another service on your host machine:
* Modify the port mapping in `docker-compose.yml` under `frontend` services (e.g., `- "8080:80"`).

### Resetting Database and Storage
To reset persistent database storage and clean data state:
```bash
docker compose down -v
docker compose up -d --build
```
