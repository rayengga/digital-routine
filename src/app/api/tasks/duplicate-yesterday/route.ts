import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateDisciplineScore } from '@/lib/discipline';

// POST /api/tasks/duplicate-yesterday - Duplicate yesterday's tasks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get yesterday's tasks
    const yesterdayTasks = await prisma.task.findMany({
      where: {
        userId,
        scheduledDate: yesterday,
      },
    });

    if (yesterdayTasks.length === 0) {
      return NextResponse.json({ message: 'No tasks from yesterday to duplicate' }, { status: 200 });
    }

    // Create new tasks for today
    const newTasks = await Promise.all(
      yesterdayTasks.map(task =>
        prisma.task.create({
          data: {
            userId: task.userId,
            name: task.name,
            category: task.category,
            customCategory: task.customCategory,
            priority: task.priority,
            estimatedDuration: task.estimatedDuration,
            scheduledDate: today,
            isRecurring: task.isRecurring,
          },
        })
      )
    );

    return NextResponse.json({ 
      message: `Duplicated ${newTasks.length} tasks from yesterday`,
      tasks: newTasks 
    });
  } catch (error) {
    console.error('Error duplicating tasks:', error);
    return NextResponse.json({ error: 'Failed to duplicate tasks' }, { status: 500 });
  }
}
