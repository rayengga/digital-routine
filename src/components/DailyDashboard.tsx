'use client';

import { useEffect, useState } from 'react';
import { Task, TaskCategory, TaskPriority } from '@prisma/client';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import DisciplineScore from './DisciplineScore';
import { Plus, Copy } from 'lucide-react';
import { formatDate, getTodayDate } from '@/lib/utils';

interface DailyDashboardProps {
  userId: string;
}

export default function DailyDashboard({ userId }: DailyDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [today] = useState(getTodayDate());

  const fetchTasks = async () => {
    try {
      const dateStr = today.toISOString().split('T')[0];
      const res = await fetch(`/api/tasks?userId=${userId}&date=${dateStr}`);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const handleTaskCreated = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleDuplicateYesterday = async () => {
    try {
      const res = await fetch('/api/tasks/duplicate-yesterday', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      
      if (data.tasks && data.tasks.length > 0) {
        await fetchTasks();
      } else {
        alert(data.message || 'No tasks from yesterday to duplicate');
      }
    } catch (error) {
      console.error('Error duplicating tasks:', error);
      alert('Failed to duplicate tasks');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900">{formatDate(today)}</h2>
        <p className="text-sm text-gray-600 mt-1">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} scheduled
        </p>
      </div>

      {/* Discipline Score */}
      <DisciplineScore tasks={tasks} />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setShowTaskForm(true)}
          className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Task
        </button>
        <button
          onClick={handleDuplicateYesterday}
          className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          <Copy className="w-5 h-5 mr-2" />
          Duplicate Yesterday
        </button>
      </div>

      {/* Task Form */}
      {showTaskForm && (
        <TaskForm
          userId={userId}
          scheduledDate={today}
          onTaskCreated={handleTaskCreated}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {/* Task List */}
      <TaskList
        tasks={tasks}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />
    </div>
  );
}
