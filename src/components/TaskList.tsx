'use client';

import { useState } from 'react';
import { Task } from '@prisma/client';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export default function TaskList({ tasks, onTaskUpdated, onTaskDeleted }: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed && !task.skipped;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Priority: HIGH > MEDIUM > LOW
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then by creation time
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No tasks scheduled for today.</p>
        <p className="text-sm text-gray-400 mt-2">Click &quot;Add Task&quot; to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-2 flex gap-2">
        {(['all', 'pending', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-2 text-xs">
              ({f === 'all' ? tasks.length : f === 'completed' 
                ? tasks.filter(t => t.completed).length 
                : tasks.filter(t => !t.completed && !t.skipped).length})
            </span>
          </button>
        ))}
      </div>

      {/* Task Items */}
      <div className="space-y-3">
        {sortedTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onTaskUpdated={onTaskUpdated}
            onTaskDeleted={onTaskDeleted}
          />
        ))}

        {sortedTasks.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
            No {filter} tasks
          </div>
        )}
      </div>
    </div>
  );
}
