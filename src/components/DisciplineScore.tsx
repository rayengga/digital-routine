'use client';

import { Task } from '@prisma/client';
import { calculateDisciplineScore, getDisciplineScoreColor } from '@/lib/discipline';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DisciplineScoreProps {
  tasks: Task[];
}

export default function DisciplineScore({ tasks }: DisciplineScoreProps) {
  const { score, breakdown } = calculateDisciplineScore(tasks);

  const getScoreGrade = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Discipline Score</h3>
        {score >= 70 ? (
          <TrendingUp className="w-5 h-5 text-green-600" />
        ) : (
          <TrendingDown className="w-5 h-5 text-red-600" />
        )}
      </div>

      <div className="flex items-end gap-4 mb-4">
        <div className={`text-5xl font-bold ${getDisciplineScoreColor(score)}`}>
          {score.toFixed(1)}
        </div>
        <div className="pb-2">
          <div className="text-sm text-gray-600">out of 100</div>
          <div className={`text-sm font-medium ${getDisciplineScoreColor(score)}`}>
            {getScoreGrade(score)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{completedCount} / {totalCount} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <div className="text-xs text-gray-600 mb-1">Completion Rate</div>
            <div className="text-lg font-semibold text-gray-900">
              {breakdown.completionRate.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Penalty Points</div>
            <div className="text-lg font-semibold text-red-600">
              -{breakdown.penaltyPoints}
            </div>
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Add tasks to see your discipline score
        </div>
      )}
    </div>
  );
}
