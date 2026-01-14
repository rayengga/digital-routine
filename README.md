# Digital Routine - Discipline Tracking SaaS

A production-ready daily routine tracking application focused on discipline analytics and self-improvement through data-driven insights.

## 🎯 Features

### Core Functionality
- **Daily Routine Dashboard**: Track today's tasks with an intuitive checklist interface
- **Smart Task Management**: CRUD operations with task categories, priorities, and duration estimates
- **Forced Accountability**: When marking tasks incomplete, users must provide either:
  - A predefined reason (lack of discipline, bad planning, fatigue, distraction, unrealistic task)
  - A custom text explanation
- **Discipline Scoring**: 0-100 score calculated from completion rate and skip reason severity
- **Analytics Dashboard**: Calendar view with historical data and insights
- **Flexible Planning**: Duplicate yesterday's routine, reschedule tasks, and track modifications

### Analytics & Insights
- Daily discipline score with visual feedback
- Completion rate tracking
- Most common failure reasons
- Historical calendar view with color-coded scores
- 30-day trends and statistics

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for responsive, mobile-first styling
- **Lucide Icons** for clean UI elements

### Backend
- **Next.js API Routes** (serverless architecture)
- **Node.js** runtime
- **Zod** for API validation

### Database
- **PostgreSQL** (production-grade relational database)
- **Prisma ORM** for type-safe database access

### Why These Choices?

#### PostgreSQL over MongoDB
- ✅ **Structured data**: Tasks have clear relationships and defined schema
- ✅ **ACID compliance**: Critical for data integrity in analytics
- ✅ **Complex queries**: Analytics require joins, aggregations, and date-based filtering
- ✅ **Data consistency**: Discipline scores depend on accurate historical data

#### Next.js API Routes over Express
- ✅ **Simpler deployment**: Single codebase, serverless-ready
- ✅ **Type sharing**: Share types between frontend and backend
- ✅ **Built-in optimization**: Automatic code splitting and caching
- ✅ **Better DX**: Hot reload for both frontend and API changes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd "degital routine"
   npm install
   ```

2. **Set up your database**:
   - Create a PostgreSQL database
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `DATABASE_URL` in `.env`:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/digital_routine"
     ```

3. **Initialize the database**:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Database seeding
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── tasks/     # Task CRUD operations
│   │   │   ├── analytics/ # Analytics endpoints
│   │   │   └── users/     # User management
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/
│   │   ├── DailyDashboard.tsx      # Main dashboard
│   │   ├── DisciplineScore.tsx     # Score display
│   │   ├── TaskList.tsx            # Task list view
│   │   ├── TaskItem.tsx            # Individual task
│   │   ├── TaskForm.tsx            # Create task form
│   │   ├── SkipReasonModal.tsx     # Skip reason modal
│   │   └── HistoryView.tsx         # Calendar & history
│   └── lib/
│       ├── prisma.ts      # Prisma client
│       ├── discipline.ts  # Discipline calculation logic
│       └── utils.ts       # Utility functions
└── package.json
```

## 🎨 UI/UX Features

- **Mobile-First Design**: Optimized for daily phone usage
- **Clear Visual Feedback**: Color-coded discipline scores
- **Smooth Interactions**: No clutter, intuitive flows
- **Smart Defaults**: Sensible task templates and quick actions
- **Responsive Layout**: Works seamlessly on all devices

## 📊 Discipline Score Algorithm

The discipline score (0-100) is calculated using:

- **70% weight**: Task completion rate
- **30% weight**: Penalty based on skip reasons
  - Lack of Discipline: -10 points
  - Distraction: -8 points
  - Bad Planning: -5 points
  - Other: -5 points
  - Fatigue: -3 points
  - Unrealistic Task: -2 points

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database

# Production
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📝 API Endpoints

### Tasks
- `GET /api/tasks?userId={id}&date={date}` - Get tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task
- `POST /api/tasks/duplicate-yesterday` - Duplicate yesterday's tasks

### Analytics
- `GET /api/analytics/daily?userId={id}&date={date}` - Get daily stats
- `GET /api/analytics/history?userId={id}&days={30}` - Get historical data

### Users
- `GET /api/users/demo` - Get demo user

## 🎯 Key Features Breakdown

### Task Completion Logic
- ✅ **Completed**: One-click completion
- ❌ **Skipped**: Must select reason OR provide explanation
- 🗑️ **Deleted**: Confirmation required

### Task Categories
- Work
- Study
- Health
- Personal
- Custom (user-defined)

### Priority Levels
- High (red flag)
- Medium (yellow flag)
- Low (gray flag)

### Skip Reasons
1. Lack of Discipline
2. Bad Planning
3. Fatigue
4. Distraction
5. Unrealistic Task
6. Other (with explanation)

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy!

### Environment Variables
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

## 🔐 Future Enhancements

- [ ] User authentication (NextAuth.js)
- [ ] Multi-user support
- [ ] Recurring tasks automation
- [ ] Task templates
- [ ] Weekly/monthly reports
- [ ] Goal setting and tracking
- [ ] Social features (accountability partners)
- [ ] Mobile app (React Native)
- [ ] Export data (CSV, PDF)
- [ ] AI-powered insights

## 📄 License

MIT License - feel free to use this for your own projects!

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

Built with ❤️ using Next.js, PostgreSQL, and TypeScript
