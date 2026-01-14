'use client';

import { useEffect, useState } from 'react';
import { DailyStats } from '@prisma/client';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { getDisciplineScoreColor } from '@/lib/discipline';

interface HistoryViewProps {
  userId: string;
}

interface HistorySummary {
  dailyStats: DailyStats[];
  summary: {
    totalTasks: number;
    completedTasks: number;
    skippedTasks: number;
    avgDisciplineScore: number;
    completionRate: number;
    mostCommonFailureReason: string | null;
    lackOfDisciplineCount: number;
    badPlanningCount: number;
    fatigueCount: number;
    distractionCount: number;
    unrealisticTaskCount: number;
    otherCount: number;
  };
}

export default function HistoryView({ userId }: HistoryViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [historyData, setHistoryData] = useState<HistorySummary | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/analytics/history?userId=${userId}&days=30`);
      const data = await res.json();
      setHistoryData(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDayStats = (date: Date): DailyStats | undefined => {
    if (!historyData) return undefined;
    return historyData.dailyStats.find(stat => 
      isSameDay(new Date(stat.date), date)
    );
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Get first day of week for padding
    const firstDayOfWeek = monthStart.getDay();
    const padding = Array(firstDayOfWeek).fill(null);

    return (
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}

        {/* Padding */}
        {padding.map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {/* Days */}
        {days.map(day => {
          const stats = getDayStats(day);
          const hasData = !!stats && stats.totalTasks > 0;
          const score = stats?.disciplineScore || 0;

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`aspect-square p-2 rounded-lg border transition-all ${
                !isSameMonth(day, currentMonth)
                  ? 'text-gray-300'
                  : isToday(day)
                  ? 'border-primary-600 bg-primary-50'
                  : selectedDate && isSameDay(day, selectedDate)
                  ? 'border-primary-400 bg-primary-100'
                  : hasData
                  ? 'border-gray-200 hover:border-gray-300'
                  : 'border-gray-100 text-gray-400'
              }`}
            >
              <div className="text-sm font-medium">{format(day, 'd')}</div>
              {hasData && (
                <div className={`text-xs font-bold mt-1 ${getDisciplineScoreColor(score)}`}>
                  {score.toFixed(0)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const selectedStats = selectedDate ? getDayStats(selectedDate) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {historyData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {historyData.summary.avgDisciplineScore.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">Avg Discipline Score</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {historyData.summary.completionRate}%
                </div>
                <div className="text-xs text-gray-600">Completion Rate</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {historyData.summary.mostCommonFailureReason || 'None'}
                </div>
                <div className="text-xs text-gray-600">Top Failure Reason</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentMonth(subDays(currentMonth, 30))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-2 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentMonth(subDays(currentMonth, -30))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {renderCalendar()}
      </div>

      {/* Selected Day Details */}
      {selectedDate && selectedStats && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">{selectedStats.totalTasks}</div>
              <div className="text-xs text-gray-600">Total Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{selectedStats.completedTasks}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{selectedStats.skippedTasks}</div>
              <div className="text-xs text-gray-600">Skipped</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${getDisciplineScoreColor(selectedStats.disciplineScore)}`}>
                {selectedStats.disciplineScore.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Discipline Score</div>
            </div>
          </div>

          {/* Skip Reasons Breakdown */}
          {selectedStats.skippedTasks > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Skip Reasons:</h4>
              <div className="space-y-2 text-sm">
                {selectedStats.lackOfDisciplineCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lack of Discipline</span>
                    <span className="font-medium">{selectedStats.lackOfDisciplineCount}</span>
                  </div>
                )}
                {selectedStats.badPlanningCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bad Planning</span>
                    <span className="font-medium">{selectedStats.badPlanningCount}</span>
                  </div>
                )}
                {selectedStats.fatigueCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fatigue</span>
                    <span className="font-medium">{selectedStats.fatigueCount}</span>
                  </div>
                )}
                {selectedStats.distractionCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distraction</span>
                    <span className="font-medium">{selectedStats.distractionCount}</span>
                  </div>
                )}
                {selectedStats.unrealisticTaskCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unrealistic Task</span>
                    <span className="font-medium">{selectedStats.unrealisticTaskCount}</span>
                  </div>
                )}
                {selectedStats.otherCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other</span>
                    <span className="font-medium">{selectedStats.otherCount}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedDate && !selectedStats && (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
          No tasks recorded for {format(selectedDate, 'MMMM d, yyyy')}
        </div>
      )}
    </div>
  );
}
