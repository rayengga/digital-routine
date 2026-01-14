# 🚀 Quick Start Guide

## One-Time Setup (5 minutes)

### 1️⃣ Install PostgreSQL
**Choose one:**

**Option A: Use Free Cloud Database** (Easiest)
- Go to https://neon.tech or https://supabase.com
- Sign up free
- Create new project
- Copy connection string

**Option B: Local PostgreSQL** (macOS)
```bash
brew install postgresql@16
brew services start postgresql@16
createdb digital_routine
```

### 2️⃣ Configure Database
Edit `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/digital_routine"
```

### 3️⃣ Initialize Database
```bash
npm run db:generate    # Generate Prisma client
npm run db:push       # Create tables
npm run db:seed       # Add demo data
```

### 4️⃣ Start App
```bash
npm run dev
```

Open: http://localhost:3000

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push         # Update database schema
npm run db:studio       # Open database GUI
npm run db:seed         # Add demo data

# Production
npm run build           # Build for production
npm run start           # Start production server
```

---

## Troubleshooting

### "Can't reach database server"
- Check PostgreSQL is running: `brew services list`
- Verify DATABASE_URL in `.env`
- Test connection: `psql $DATABASE_URL`

### "Module not found: Can't resolve '@/...'"
```bash
npm run db:generate
```

### "Port 3000 already in use"
```bash
PORT=3001 npm run dev
```

### "Prisma Client initialization failed"
```bash
rm -rf node_modules .next
npm install
npm run db:generate
```

---

## Project Structure Quick Reference

```
src/
├── app/
│   ├── api/              # Backend API routes
│   │   ├── tasks/        # Task CRUD
│   │   ├── analytics/    # Stats & history
│   │   └── users/        # User management
│   └── page.tsx          # Main app
│
├── components/
│   ├── DailyDashboard    # Today view
│   ├── HistoryView       # Calendar view
│   ├── TaskList          # Task list
│   ├── TaskItem          # Task card
│   ├── TaskForm          # Create task
│   ├── SkipReasonModal   # Skip modal
│   └── DisciplineScore   # Score display
│
└── lib/
    ├── prisma.ts         # DB client
    ├── discipline.ts     # Score logic
    └── utils.ts          # Helpers
```

---

## Key Features at a Glance

✅ **Daily Dashboard** - Track today's tasks
✅ **Discipline Score** - 0-100 with smart penalties
✅ **Skip Accountability** - Must explain why
✅ **Calendar View** - See 30-day history
✅ **Quick Actions** - Duplicate yesterday
✅ **Analytics** - Track patterns & trends
✅ **Mobile-First** - Works great on phones

---

## Database Tables

**User** - User accounts
**Task** - Individual tasks with status
**DailyStats** - Calculated daily metrics

---

## Need Help?

- 📖 Full docs: [README.md](README.md)
- 🔧 Setup help: [SETUP.md](SETUP.md)
- ✅ Feature list: [PROJECT_COMPLETE.md](PROJECT_COMPLETE.md)

---

**Status**: ✅ Ready to run with `npm run dev`
