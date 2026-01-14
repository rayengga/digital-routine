import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays, startOfDay } from 'date-fns';

// GET /api/analytics/history - Get historical statistics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const today = startOfDay(new Date());
    const startDate = subDays(today, days);

    const stats = await prisma.dailyStats.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: today,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Calculate aggregate statistics
    const totalStats = stats.reduce(
      (acc, day) => ({
        totalTasks: acc.totalTasks + day.totalTasks,
        completedTasks: acc.completedTasks + day.completedTasks,
        skippedTasks: acc.skippedTasks + day.skippedTasks,
        avgDisciplineScore: acc.avgDisciplineScore + day.disciplineScore,
        lackOfDisciplineCount: acc.lackOfDisciplineCount + day.lackOfDisciplineCount,
        badPlanningCount: acc.badPlanningCount + day.badPlanningCount,
        fatigueCount: acc.fatigueCount + day.fatigueCount,
        distractionCount: acc.distractionCount + day.distractionCount,
        unrealisticTaskCount: acc.unrealisticTaskCount + day.unrealisticTaskCount,
        otherCount: acc.otherCount + day.otherCount,
      }),
      {
        totalTasks: 0,
        completedTasks: 0,
        skippedTasks: 0,
        avgDisciplineScore: 0,
        lackOfDisciplineCount: 0,
        badPlanningCount: 0,
        fatigueCount: 0,
        distractionCount: 0,
        unrealisticTaskCount: 0,
        otherCount: 0,
      }
    );

    if (stats.length > 0) {
      totalStats.avgDisciplineScore = totalStats.avgDisciplineScore / stats.length;
    }

    // Find most common failure reason
    const reasonCounts = [
      { reason: 'Lack of Discipline', count: totalStats.lackOfDisciplineCount },
      { reason: 'Bad Planning', count: totalStats.badPlanningCount },
      { reason: 'Fatigue', count: totalStats.fatigueCount },
      { reason: 'Distraction', count: totalStats.distractionCount },
      { reason: 'Unrealistic Task', count: totalStats.unrealisticTaskCount },
      { reason: 'Other', count: totalStats.otherCount },
    ];

    const mostCommonReason = reasonCounts.reduce((max, current) =>
      current.count > max.count ? current : max
    );

    return NextResponse.json({
      dailyStats: stats,
      summary: {
        ...totalStats,
        avgDisciplineScore: Math.round(totalStats.avgDisciplineScore * 10) / 10,
        completionRate: totalStats.totalTasks > 0
          ? Math.round((totalStats.completedTasks / totalStats.totalTasks) * 100)
          : 0,
        mostCommonFailureReason: mostCommonReason.count > 0 ? mostCommonReason.reason : null,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics history:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics history' }, { status: 500 });
  }
}
