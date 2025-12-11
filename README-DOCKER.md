# Quick Start

## Build and Run

```powershell
# Using docker-compose (recommended)
docker-compose -f docker-compose.simple.yml up -d

# Or build manually
docker build -f Dockerfile.simple -t sport4everyone .
docker run -d -p 3000:3000 -v sport4everyone-data:/app/data sport4everyone
```

## Access
Open http://localhost:3000

## Stop
```powershell
docker-compose -f docker-compose.simple.yml down
```

## Database Persistence
Database is stored in `app-data` volume. To backup:
```powershell
docker run --rm -v sport4everyone-data:/data -v ${PWD}:/backup alpine tar czf /backup/db-backup.tar.gz /data
```
