import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get or create demo user
    let user = await prisma.user.findUnique({
      where: { email: 'demo@digitalroutine.com' },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'demo@digitalroutine.com',
          name: 'Demo User',
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching demo user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
