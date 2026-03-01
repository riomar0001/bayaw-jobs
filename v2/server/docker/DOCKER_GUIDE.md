# Docker Compose Guide

This guide explains how to run the Docker Compose setup for the Bayaw Jobs server infrastructure (bayaw-jobs-db).

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
├── .env                  # Environment variables (optional)
└── DOCKER_GUIDE.md       # This guide
```

## Project Overview

**Project Name:** `bayaw-jobs-db`

This Docker Compose setup includes:
- **PostgreSQL 16** - Primary database
- **pgAdmin** - PostgreSQL web management UI
- **Redis 7** - In-memory cache and session store
- **RedisInsight** - Redis web management UI

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
- **Container Name:** `postgres_instance`
- **Service Name:** `postgres`
- **Port:** `5432` (default, configurable via `POSTGRES_PORT` env var)
- **Username:** `postgres`
- **Password:** `password`
- **Database:** `postgres`
- **Data Volume:** `postgres_data`

**Access PostgreSQL:**
```bash
docker compose exec postgres psql -U postgres -d postgres
```

### pgAdmin (PostgreSQL Management UI)
- **Container Name:** `pgadmin`
- **Service Name:** `pgadmin`
- **Web URL:** `http://localhost:5050`
- **Email:** `admin@admin.com`
- **Password:** `admin123`
- **Data Volume:** `pgadmin_data`

**How to Access:**
1. Open `http://localhost:5050` in your browser
2. Login with the credentials above
3. Add a new server connection:
   - **Name:** PostgreSQL
   - **Hostname:** `postgres` (service name)
   - **Port:** `5432`
   - **Username:** `postgres`
   - **Password:** `password`

### Redis
- **Container Name:** `redis_instance`
- **Service Name:** `redis`
- **Port:** `6379` (default, configurable via `REDIS_PORT` env var)
- **Password:** `password`
- **Data Volume:** `redis_data`

**Access Redis:**
```bash
docker compose exec redis redis-cli -a password
```

### RedisInsight (Redis Management UI)
- **Container Name:** `redisinsight`
- **Service Name:** `redisinsight`
- **Web URL:** `http://localhost:5540`
- **Connection Required:** None (auto-connects to Redis service)

**How to Access:**
1. Open `http://localhost:5540` in your browser
2. RedisInsight should automatically detect the Redis service
3. If not, add connection manually:
   - **Host:** `redis` (service name)
   - **Port:** `6379`
   - **Password:** `password`

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
docker compose logs pgadmin
docker compose logs redis
docker compose logs redisinsight
```

Follow logs in real-time:
```bash
docker compose logs -f
docker compose logs -f postgres
docker compose logs -f redis
```

Restart a service:
```bash
docker compose restart postgres
docker compose restart pgadmin
docker compose restart redis
docker compose restart redisinsight
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

### Redis Operations

Get Redis info:
```bash
docker compose exec redis redis-cli -a password info
```

Check Redis keys:
```bash
docker compose exec redis redis-cli -a password keys "*"
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

**Note:** pgAdmin and RedisInsight ports (5050 and 5540) are fixed and cannot be changed via environment variables. If these ports are in use, modify the `docker-compose.yml` file directly.

## Important Configuration Notes

### Missing pgadmin_data Volume

The current `docker-compose.yml` references `pgadmin_data` volume in the pgAdmin service but does not define it in the `volumes` section. Add this to the `volumes` section:

```yaml
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  pgadmin_data:        # <- Add this
    driver: local
```

Without this, pgAdmin configuration and saved connections will be lost when containers restart.

## Health Checks

PostgreSQL, Redis, and their management services have built-in health checks:

**PostgreSQL:**
- Check interval: 10 seconds
- Timeout: 5 seconds
- Retries: 5

**Redis:**
- Check interval: 10 seconds
- Timeout: 5 seconds
- Retries: 5

**Dependencies:**
- pgAdmin depends on PostgreSQL being healthy
- RedisInsight depends on Redis running

View health status:
```bash
docker compose ps
```

The `STATUS` column will show `(healthy)` or `(unhealthy)`.

## Network

All services are connected to the `bayaw_jobs_network` Docker bridge network, allowing them to communicate using their service names:

```
postgres:5432
pgadmin:80
redis:6379
redisinsight:5540
```

## Management Interfaces

### pgAdmin - PostgreSQL Management UI
- **URL:** http://localhost:5050
- **Default Credentials:**
  - Email: `admin@admin.com`
  - Password: `admin123`
- **Features:** Database management, query execution, backup/restore

### RedisInsight - Redis Management UI
- **URL:** http://localhost:5540
- **No authentication required** (accessed on local network)
- **Features:** Key management, monitoring, command execution

## Troubleshooting

### Port Already in Use

If you get a port conflict error, check which service is using the port:
```bash
# Windows
netstat -ano | findstr :<PORT_NUMBER>

# Linux/Mac
lsof -i :<PORT_NUMBER>
```

Then either:
- Stop the conflicting service
- Change the port in `.env` file
- Use different port mappings in docker-compose.yml

### Services Not Healthy

Check service logs:
```bash
docker compose logs postgres
docker compose logs redis
docker compose logs pgadmin
docker compose logs redisinsight
```

Restart services:
```bash
docker compose restart
```

### Cannot Connect to Management UIs

**pgAdmin not accessible at localhost:5050:**
```bash
docker compose logs pgadmin
docker compose exec pgadmin curl http://localhost/
```

**RedisInsight not accessible at localhost:5540:**
```bash
docker compose logs redisinsight
# RedisInsight takes a moment to start, wait 10-15 seconds
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

### Connection Issues from Application

Make sure to use the service names as hostnames when connecting from your Node.js application:

**Inside Docker network:**
```
postgres (not localhost)
redis (not localhost)
```

**From host machine (during development):**
```
localhost:5432 (PostgreSQL)
localhost:6379 (Redis)
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

Remove unused volumes (use caution - this deletes data):
```bash
docker volume prune
```

Remove everything unused:
```bash
docker system prune -a --volumes
```

## Integration with Development

### Connection Strings for Node.js Server

From the `v2/server` directory, use these connection strings in your `.env` file:

**PostgreSQL Connection String:**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
```

**Redis Connection String:**
```
REDIS_URL=redis://:password@localhost:6379
```

### Example Node.js Connection

```javascript
// PostgreSQL with Prisma
// .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres

// Redis client
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379,
  password: 'password'
});
```

### Docker Network Internal URLs

If your application is also running in Docker (same network):
```
PostgreSQL: postgres:5432
Redis: redis:6379
```

## Quick Reference

| Service | Container | Service Name | Port | Web UI | Credentials |
|---------|-----------|--------------|------|--------|-------------|
| PostgreSQL | postgres_instance | postgres | 5432 | - | postgres/password |
| pgAdmin | pgadmin | pgadmin | 5050 | http://localhost:5050 | admin@admin.com/admin123 |
| Redis | redis_instance | redis | 6379 | - | password only |
| RedisInsight | redisinsight | redisinsight | 5540 | http://localhost:5540 | None |

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [pgAdmin Documentation](https://www.pgadmin.org/)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [RedisInsight Documentation](https://docs.redis.com/latest/ri/)
- [Prisma Database Configuration](https://www.prisma.io/docs/reference/database-reference)
