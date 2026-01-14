import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@digitalroutine.com' },
    update: {},
    create: {
      email: 'demo@digitalroutine.com',
      name: 'Demo User',
    },
  });

  console.log('Created demo user:', user);

  // Create some sample tasks for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        userId: user.id,
        name: 'Morning workout',
        category: 'HEALTH',
        priority: 'HIGH',
        estimatedDuration: 30,
        scheduledDate: today,
      },
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        name: 'Review project documentation',
        category: 'WORK',
        priority: 'MEDIUM',
        estimatedDuration: 45,
        scheduledDate: today,
      },
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        name: 'Study TypeScript advanced patterns',
        category: 'STUDY',
        priority: 'MEDIUM',
        estimatedDuration: 60,
        scheduledDate: today,
      },
    }),
  ]);

  console.log('Created sample tasks:', tasks.length);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
