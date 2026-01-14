# Digital Routine Setup Guide

## Quick Start

This application is now fully set up with:
- ✅ Next.js 14 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS styling
- ✅ PostgreSQL + Prisma ORM
- ✅ Complete API routes
- ✅ Mobile-first UI components
- ✅ Discipline analytics system

## Before Running

### 1. Set Up PostgreSQL Database

You need a PostgreSQL database. Choose one option:

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (macOS)
brew install postgresql@16
brew services start postgresql@16

# Create database
createdb digital_routine
```

**Option B: Cloud Database (Recommended for beginners)**
- Sign up for free at [Neon](https://neon.tech) or [Supabase](https://supabase.com)
- Create a new PostgreSQL database
- Copy the connection string

### 2. Configure Database URL

Edit `.env` file and replace the DATABASE_URL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/digital_routine"
```

Or if using Neon/Supabase:
```env
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname"
```

### 3. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed with demo user and sample tasks
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### "Can't reach database server"
- Check PostgreSQL is running: `brew services list` (macOS)
- Verify DATABASE_URL credentials
- Check database exists: `psql -l`

### "Prisma Client not generated"
Run: `npm run db:generate`

### Port 3000 already in use
Run: `PORT=3001 npm run dev`

## Project Features

### Core Features Implemented ✅
- Daily task dashboard with checklist
- Task categories (Work, Study, Health, Personal, Custom)
- Priority levels (Low, Medium, High)
- Estimated duration tracking
- Forced skip reasons (accountability feature)
- Discipline score calculation (0-100)
- Completion tracking and analytics
- Calendar view with historical data
- 30-day statistics and trends
- Duplicate yesterday's routine

### Task Completion Flow
1. **Mark Complete**: ✅ One click, instant feedback
2. **Mark Skipped**: ❌ Must provide:
   - Predefined reason (lack of discipline, bad planning, fatigue, distraction, unrealistic task)
   - OR custom text explanation

### Discipline Score Algorithm
- **70% weight**: Task completion rate
- **30% weight**: Penalty from skip reasons
  - Lack of Discipline: -10 pts
  - Distraction: -8 pts
  - Bad Planning: -5 pts
  - Other: -5 pts
  - Fatigue: -3 pts
  - Unrealistic Task: -2 pts

## Architecture

### Tech Justifications

**PostgreSQL vs MongoDB:**
- ✅ Structured relational data
- ✅ ACID compliance for analytics
- ✅ Complex queries (joins, aggregations)
- ✅ Data consistency for scoring

**Next.js API Routes vs Express:**
- ✅ Simpler deployment (single codebase)
- ✅ Type sharing between frontend/backend
- ✅ Built-in optimizations
- ✅ Serverless-ready

## Database Schema

```prisma
User
├── id: String (cuid)
├── email: String (unique)
├── name: String
└── tasks: Task[]

Task
├── id: String (cuid)
├── userId: String
├── name: String
├── category: Enum (WORK, STUDY, HEALTH, PERSONAL, CUSTOM)
├── priority: Enum (LOW, MEDIUM, HIGH)
├── estimatedDuration: Int (minutes)
├── scheduledDate: DateTime
├── completed: Boolean
├── skipped: Boolean
├── skipReason: Enum
└── skipExplanation: String

DailyStats
├── id: String (cuid)
├── userId: String
├── date: DateTime
├── totalTasks: Int
├── completedTasks: Int
├── skippedTasks: Int
├── disciplineScore: Float
└── [reason counts...]
```

## API Routes

### Tasks
- `GET /api/tasks?userId=&date=` - Get tasks for date
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task
- `POST /api/tasks/duplicate-yesterday` - Duplicate routine

### Analytics
- `GET /api/analytics/daily?userId=&date=` - Daily stats
- `GET /api/analytics/history?userId=&days=30` - Historical data

## Next Steps

1. **Set up database** (see above)
2. **Run the app**: `npm run dev`
3. **Customize**: Add your own categories, modify scoring
4. **Deploy**: Push to Vercel or similar platform

## Need Help?

- Check README.md for detailed documentation
- Review Prisma schema: `prisma/schema.prisma`
- Explore API routes: `src/app/api/`
- View components: `src/components/`

---

Happy tracking! 🎯
