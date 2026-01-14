'use client';

import { useState } from 'react';
import { Task, SkipReason } from '@prisma/client';
import { getCategoryColor, getPriorityColor, getSkipReasonLabel } from '@/lib/discipline';
import { formatTime } from '@/lib/utils';
import { Check, X, Trash2, Clock, Flag, Tag } from 'lucide-react';
import SkipReasonModal from './SkipReasonModal';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export default function TaskItem({ task, onTaskUpdated, onTaskDeleted }: TaskItemProps) {
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleComplete = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        onTaskUpdated(updatedTask);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSkip = () => {
    setShowSkipModal(true);
  };

  const handleSkipConfirm = async (reason: SkipReason, explanation?: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skipped: true,
          skipReason: reason,
          skipExplanation: explanation || null,
        }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        onTaskUpdated(updatedTask);
        setShowSkipModal(false);
      }
    } catch (error) {
      console.error('Error skipping task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onTaskDeleted(task.id);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const categoryColor = getCategoryColor(task.category);
  const priorityColor = getPriorityColor(task.priority);

  return (
    <>
      <div className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${
        task.completed ? 'border-green-500 bg-green-50/30' : 
        task.skipped ? 'border-red-500 bg-red-50/30' : 
        'border-primary-500'
      }`}>
        <div className="flex items-start justify-between gap-4">
          {/* Task Info */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium text-gray-900 ${
              task.completed || task.skipped ? 'line-through text-gray-500' : ''
            }`}>
              {task.name}
            </h4>

            <div className="flex flex-wrap gap-3 mt-2">
              {/* Category */}
              <div className="flex items-center text-xs text-gray-600">
                <Tag className="w-3 h-3 mr-1" />
                <span className={`px-2 py-0.5 rounded-full text-white ${categoryColor}`}>
                  {task.customCategory || task.category}
                </span>
              </div>

              {/* Priority */}
              <div className={`flex items-center text-xs ${priorityColor}`}>
                <Flag className="w-3 h-3 mr-1" />
                {task.priority}
              </div>

              {/* Duration */}
              <div className="flex items-center text-xs text-gray-600">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(task.estimatedDuration)}
              </div>
            </div>

            {/* Skip Info */}
            {task.skipped && task.skipReason && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                <strong>Skipped:</strong> {getSkipReasonLabel(task.skipReason)}
                {task.skipExplanation && ` - ${task.skipExplanation}`}
              </div>
            )}

            {task.completed && (
              <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                ✓ Completed
              </div>
            )}
          </div>

          {/* Actions */}
          {!task.completed && !task.skipped && (
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleComplete}
                disabled={isUpdating}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                title="Mark as complete"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={handleSkip}
                disabled={isUpdating}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                title="Mark as skipped"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}

          {(task.completed || task.skipped) && (
            <button
              onClick={handleDelete}
              className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex-shrink-0"
              title="Delete task"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {showSkipModal && (
        <SkipReasonModal
          onConfirm={handleSkipConfirm}
          onCancel={() => setShowSkipModal(false)}
        />
      )}
    </>
  );
}
