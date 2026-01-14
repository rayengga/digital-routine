import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createTaskSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, 'Task name is required'),
  category: z.enum(['WORK', 'STUDY', 'HEALTH', 'PERSONAL', 'CUSTOM']),
  customCategory: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  estimatedDuration: z.number().min(1, 'Duration must be at least 1 minute'),
  scheduledDate: z.string(),
  isRecurring: z.boolean().optional(),
});

// GET /api/tasks - Get tasks for a specific date
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    let query: any = { userId };

    if (date) {
      const targetDate = new Date(date);
      query.scheduledDate = targetDate;
    }

    const tasks = await prisma.task.findMany({
      where: query,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);

    const task = await prisma.task.create({
      data: {
        ...validatedData,
        scheduledDate: new Date(validatedData.scheduledDate),
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
