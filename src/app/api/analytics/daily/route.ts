import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateDisciplineScore } from '@/lib/discipline';

// GET /api/analytics/daily - Get daily statistics for a specific date
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId || !date) {
      return NextResponse.json({ error: 'userId and date are required' }, { status: 400 });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Get tasks for the date
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        scheduledDate: targetDate,
      },
    });

    // Calculate stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const skippedTasks = tasks.filter(t => t.skipped).length;

    // Calculate discipline score
    const { score } = calculateDisciplineScore(tasks);

    // Count skip reasons
    const skipReasonCounts = {
      lackOfDisciplineCount: tasks.filter(t => t.skipReason === 'LACK_OF_DISCIPLINE').length,
      badPlanningCount: tasks.filter(t => t.skipReason === 'BAD_PLANNING').length,
      fatigueCount: tasks.filter(t => t.skipReason === 'FATIGUE').length,
      distractionCount: tasks.filter(t => t.skipReason === 'DISTRACTION').length,
      unrealisticTaskCount: tasks.filter(t => t.skipReason === 'UNREALISTIC_TASK').length,
      otherCount: tasks.filter(t => t.skipReason === 'OTHER').length,
    };

    // Upsert daily stats
    const stats = await prisma.dailyStats.upsert({
      where: {
        date: targetDate,
      },
      update: {
        totalTasks,
        completedTasks,
        skippedTasks,
        disciplineScore: score,
        ...skipReasonCounts,
      },
      create: {
        userId,
        date: targetDate,
        totalTasks,
        completedTasks,
        skippedTasks,
        disciplineScore: score,
        ...skipReasonCounts,
      },
    });

    return NextResponse.json({
      stats,
      tasks,
    });
  } catch (error) {
    console.error('Error fetching daily analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
