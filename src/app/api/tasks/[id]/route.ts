import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateTaskSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(['WORK', 'STUDY', 'HEALTH', 'PERSONAL', 'CUSTOM']).optional(),
  customCategory: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  estimatedDuration: z.number().min(1).optional(),
  scheduledDate: z.string().optional(),
  completed: z.boolean().optional(),
  skipped: z.boolean().optional(),
  skipReason: z.enum(['LACK_OF_DISCIPLINE', 'BAD_PLANNING', 'FATIGUE', 'DISTRACTION', 'UNREALISTIC_TASK', 'OTHER']).optional(),
  skipExplanation: z.string().optional(),
});

// GET /api/tasks/[id] - Get a specific task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// PATCH /api/tasks/[id] - Update a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updateData: any = { ...validatedData };

    // Handle completion
    if (validatedData.completed === true) {
      updateData.completedAt = new Date();
      updateData.skipped = false;
      updateData.skipReason = null;
      updateData.skipExplanation = null;
    }

    // Handle skip - must have reason or explanation
    if (validatedData.skipped === true) {
      if (!validatedData.skipReason && !validatedData.skipExplanation) {
        return NextResponse.json(
          { error: 'Skip reason or explanation is required when marking task as skipped' },
          { status: 400 }
        );
      }
      updateData.completed = false;
      updateData.completedAt = null;
    }

    // Convert date string to Date if provided
    if (validatedData.scheduledDate) {
      updateData.scheduledDate = new Date(validatedData.scheduledDate);
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.task.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
