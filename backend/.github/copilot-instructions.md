# Predictive Maintenance Backend - AI Agent Instructions

## Project Overview
Node.js/Express backend for an AI-powered predictive maintenance system that monitors industrial machines, predicts failures, manages alerts, and provides conversational AI support for maintenance teams.

## Architecture & Data Flow

### Core System Flow
1. **Sensor Data Ingestion** → `SENSOR_READINGS` table stores real-time machine telemetry
2. **ML Inference Jobs** → Batch predictions via `INFERENCE_JOBS`, creates `PREDICTIONS` entries
3. **Alert Generation** → Critical predictions trigger `ALERTS` with full lifecycle tracking
4. **Maintenance Workflow** → Alerts → Acknowledgements → Assignments → Resolutions → `MAINTENANCE_LOGS`
5. **AI Copilot** → `CHAT_CONVERSATIONS` provide context-aware assistance referencing machines, alerts, predictions, and maintenance history

### Key Database Relationships
- **MACHINES** (serial as PK) → core entity referenced by sensors, alerts, maintenance logs, chat context
- **PREDICTIONS** link sensor readings to failure types, generate alerts
- **ALERTS** have complex lifecycle: acknowledgements, assignments (with dual user relations: assigned_to/assigned_by), resolutions, and full history tracking
- **CHAT_MESSAGE_CONTEXT** connects conversations to any entity (alerts, machines, predictions, maintenance logs) for contextual AI responses

## Prisma Configuration (CRITICAL)

### Custom Client Location
Prisma Client generates to **`src/generated/prisma`** (not default `node_modules`):
```javascript
// schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}
```

**Import pattern in controllers:**
```javascript
import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();
```

### Database Connection
- PostgreSQL via Docker Compose (port **5434**, not default 5432)
- Connection string: `postgresql://capstone_user:accenturer25@localhost:5434/capstone_db?schema=public`
- Always use environment variable: `DATABASE_URL` in `.env`

## Development Workflows

### Essential Commands
```bash
# Development (hot reload with --watch)
npm run dev

# Database migrations (ALWAYS run after schema changes)
npm run migrate

# Visual database browser
npm run prisma:studio

# After schema.prisma changes (regenerates client)
npx prisma generate
```

### Docker Database Management
```bash
# Start database
docker-compose up -d

# Reset database completely (drops all data)
docker-compose down -v && docker-compose up -d
# Wait 10s, then: npm run migrate

# View logs
docker-compose logs -f postgres
```

## Code Conventions

### File Structure Pattern
```
src/
  ├── server.js              # Entry point, middleware, route registration
  ├── controllers/           # Business logic, return JSON responses
  │   ├── machineController.js
  │   └── sensorController.js
  └── routes/                # Express routers, URL path definitions
      ├── machineRoutes.js   # Mounts to /machines
      └── sensorRoutes.js    # Mounts to /sensor-data
```

### Route/Controller Pattern
**Routes define URL structure:**
```javascript
// routes/machineRoutes.js
import { getMachines } from '../controllers/machineController.js';
const router = express.Router();
router.get("/", getMachines);  // GET /machines
export default router;
```

**Controllers implement logic:**
```javascript
// controllers/machineController.js
export const getMachines = (req, res) => {
  // Query Prisma, return JSON
  res.json([...]);
};
```

### ES Modules (type: "module")
- Always use `.js` extensions in imports: `'./routes/machineRoutes.js'`
- Use `import/export`, not `require/module.exports`

## Database Schema Insights

### Important Table Details
- **MACHINES.serial** (string PK) vs **MACHINES.product_id** (unique) - use `serial` for relations
- **ALERTS.id** (string/VarChar) - custom alert ID format
- **Timestamps**: Most tables use `created_at`; alerts add `updated_at` (auto-managed)
- **UUIDs**: Users, roles, conversations use `@default(uuid())`
- **BigInt IDs**: Sensor readings, predictions, logs use auto-increment BigInt

### Typo Alert
`PREDICTIONS.confidance_score` (misspelled) - keep for schema consistency

### Composite Indexes
Critical performance indexes on:
- `SENSOR_READINGS`: `(machine_serial, reading_timestamp)`
- `ALERTS`: `(status, priority)` for dashboard queries

## Current Implementation Status

### ✅ Implemented (Mock Data)
- `GET /machines` - Returns hardcoded machine list
- `GET /sensor-data/latest` - Returns mock sensor reading
- `GET /predictions/latest` - Returns mock prediction

### ⚠️ Next Steps (Need Prisma Integration)
When implementing real data endpoints:
1. Import PrismaClient from `../generated/prisma/index.js`
2. Use Prisma queries (e.g., `prisma.mACHINES.findMany()`)
3. Handle errors with try-catch, return appropriate HTTP status codes
4. Add pagination for large datasets (sensor readings, alerts)

## Testing & Debugging

### Health Check
`GET /health` returns `{"status": "UP"}` - use to verify server is running

### Database Verification
```bash
# Direct PostgreSQL access
docker exec -it capstone_postgres psql -U capstone_user -d capstone_db

# Check tables
\dt

# Example query
SELECT * FROM machines LIMIT 5;
```

## Common Pitfalls

1. **Port Conflicts**: Database runs on 5434 (not 5432) - check `docker-compose.yml`
2. **Prisma Client Path**: Never import from `@prisma/client` - use custom path
3. **Migration Drift**: If schema changes, always `npm run migrate` before running server
4. **Docker Startup**: Wait 10s after `docker-compose up -d` before migrations (healthcheck delay)
5. **File Extensions**: All imports must include `.js` (ES modules requirement)

## External Integration Points
- **ML Model** (planned): Will POST to `/predictions` endpoint with inference job results
- **Frontend** (planned): Consumes REST API, expects JSON responses
- **AI Copilot Service** (planned): Will query chat context via join tables to provide contextual responses
