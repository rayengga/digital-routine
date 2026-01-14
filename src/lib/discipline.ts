import { Task, SkipReason } from '@prisma/client';

export interface DisciplineCalculation {
  score: number;
  breakdown: {
    completionRate: number;
    penaltyPoints: number;
  };
}

/**
 * Calculate daily discipline score (0-100)
 * 
 * Algorithm:
 * - Base score from completion rate (70% weight)
 * - Penalty for skip reasons (30% weight)
 *   - LACK_OF_DISCIPLINE: -10 points each
 *   - DISTRACTION: -8 points each
 *   - BAD_PLANNING: -5 points each
 *   - FATIGUE: -3 points each
 *   - UNREALISTIC_TASK: -2 points each
 *   - OTHER: -5 points each
 */
export function calculateDisciplineScore(tasks: Task[]): DisciplineCalculation {
  if (tasks.length === 0) {
    return {
      score: 0,
      breakdown: {
        completionRate: 0,
        penaltyPoints: 0,
      },
    };
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const completionRate = (completedCount / tasks.length) * 100;
  const baseScore = completionRate * 0.7; // 70% weight on completion

  // Calculate penalties for skip reasons
  const skippedTasks = tasks.filter(t => t.skipped);
  let penaltyPoints = 0;

  skippedTasks.forEach(task => {
    switch (task.skipReason) {
      case 'LACK_OF_DISCIPLINE':
        penaltyPoints += 10;
        break;
      case 'DISTRACTION':
        penaltyPoints += 8;
        break;
      case 'BAD_PLANNING':
        penaltyPoints += 5;
        break;
      case 'FATIGUE':
        penaltyPoints += 3;
        break;
      case 'UNREALISTIC_TASK':
        penaltyPoints += 2;
        break;
      case 'OTHER':
        penaltyPoints += 5;
        break;
    }
  });

  // Normalize penalty (max 30 points)
  const normalizedPenalty = Math.min(penaltyPoints, 30);
  const finalScore = Math.max(0, Math.min(100, baseScore + (30 - normalizedPenalty)));

  return {
    score: Math.round(finalScore * 10) / 10, // Round to 1 decimal
    breakdown: {
      completionRate,
      penaltyPoints: normalizedPenalty,
    },
  };
}

export function getSkipReasonLabel(reason: SkipReason): string {
  const labels: Record<SkipReason, string> = {
    LACK_OF_DISCIPLINE: 'Lack of Discipline',
    BAD_PLANNING: 'Bad Planning',
    FATIGUE: 'Fatigue',
    DISTRACTION: 'Distraction',
    UNREALISTIC_TASK: 'Unrealistic Task',
    OTHER: 'Other',
  };
  return labels[reason];
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    WORK: 'bg-blue-500',
    STUDY: 'bg-purple-500',
    HEALTH: 'bg-green-500',
    PERSONAL: 'bg-orange-500',
    CUSTOM: 'bg-gray-500',
  };
  return colors[category] || colors.CUSTOM;
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: 'text-gray-500',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-red-600',
  };
  return colors[priority] || colors.MEDIUM;
}

export function getDisciplineScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}
