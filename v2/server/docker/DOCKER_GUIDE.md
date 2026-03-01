# Docker Compose Guide

This guide explains how to run the Docker Compose setup for the Bayaw Jobs server infrastructure.

## Prerequisites

Before you begin, ensure you have installed:
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

Verify installation:
```bash
docker --version
docker compose --version
```

## File Structure

```
v2/server/docker/
├── docker-compose.yml    # Docker Compose configuration
└── DOCKER_GUIDE.md       # This guide
```

## Running Docker Compose

### Start Services

Navigate to the docker directory and run:

```bash
cd v2/server/docker
docker compose up
```

**Options:**
- Run in background (detached mode):
  ```bash
  docker compose up -d
  ```

- Rebuild images before starting:
  ```bash
  docker compose up --build
  ```

- View logs while running:
  ```bash
  docker compose up --follow
  ```

### Stop Services

Stop running containers:
```bash
docker compose stop
```

Stop and remove containers:
```bash
docker compose down
```

Stop and remove everything (including volumes):
```bash
docker compose down -v
```

## Services Configuration

### PostgreSQL
- **Container Name:** `bayaw_postgres`
- **Port:** `5432` (default, configurable via `POSTGRES_PORT` env var)
- **Username:** `postgres`
- **Password:** `password`
- **Database:** `postgres`
- **Data Volume:** `postgres_data`

**Access PostgreSQL:**
```bash
docker compose exec postgres psql -U postgres -d postgres
```

### Redis
- **Container Name:** `bayaw_redis`
- **Port:** `6379` (default, configurable via `REDIS_PORT` env var)
- **Password:** `password`
- **Data Volume:** `redis_data`

**Access Redis:**
```bash
docker compose exec redis redis-cli -a password
```

## Common Commands

### Container Management

View running containers:
```bash
docker compose ps
```

View logs:
```bash
docker compose logs
```

View logs for specific service:
```bash
docker compose logs postgres
docker compose logs redis
```

Follow logs in real-time:
```bash
docker compose logs -f
docker compose logs -f postgres
```

Restart a service:
```bash
docker compose restart postgres
docker compose restart redis
```

### Database Operations

Execute a command in PostgreSQL container:
```bash
docker compose exec postgres psql -U postgres -d postgres -c "SELECT version();"
```

Backup PostgreSQL database:
```bash
docker compose exec postgres pg_dump -U postgres postgres > backup.sql
```

Restore PostgreSQL database:
```bash
docker compose exec -T postgres psql -U postgres postgres < backup.sql
```

## Environment Variables

You can customize ports by creating a `.env` file in the docker directory:

```env
POSTGRES_PORT=5432
REDIS_PORT=6379
```

Then start Docker Compose:
```bash
docker compose --env-file .env up
```

## Health Checks

Both services have built-in health checks:

**PostgreSQL:**
- Check interval: 10 seconds
- Timeout: 5 seconds
- Retries: 5

**Redis:**
- Check interval: 10 seconds
- Timeout: 5 seconds
- Retries: 5

View health status:
```bash
docker compose ps
```

The `STATUS` column will show `(healthy)` or `(unhealthy)`.

## Network

Both services are connected to the `bayaw_network` Docker bridge network, allowing them to communicate using their service names:

```
postgres:5432
redis:6379
```

## Troubleshooting

### Port Already in Use

If you get a port conflict error:
```bash
# Change the port in .env file
# Or use:
docker compose down
```

### Services Not Healthy

Check service logs:
```bash
docker compose logs postgres
docker compose logs redis
```

Restart services:
```bash
docker compose restart
```

### Permission Denied Errors (Linux)

Add your user to the docker group:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Services Stuck or Unresponsive

Force remove containers and volumes:
```bash
docker compose down -v
docker compose up -d
```

## Cleaning Up

Remove unused Docker resources:

Remove stopped containers:
```bash
docker container prune
```

Remove unused images:
```bash
docker image prune
```

Remove unused volumes:
```bash
docker volume prune
```

Remove everything unused:
```bash
docker system prune -a --volumes
```

## Integration with Development

From the `v2/server` directory, connect to the services:

**PostgreSQL Connection String:**
```
postgresql://postgres:password@localhost:5432/postgres
```

**Redis Connection String:**
```
redis://:password@localhost:6379
```

Use these in your `.env` files for the Node.js server.

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
