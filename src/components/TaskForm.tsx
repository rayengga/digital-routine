'use client';

import { useState } from 'react';
import { Task, TaskCategory, TaskPriority } from '@prisma/client';
import { X } from 'lucide-react';

interface TaskFormProps {
  userId: string;
  scheduledDate: Date;
  onTaskCreated: (task: Task) => void;
  onCancel: () => void;
}

const categories: { value: TaskCategory; label: string }[] = [
  { value: 'WORK', label: 'Work' },
  { value: 'STUDY', label: 'Study' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'PERSONAL', label: 'Personal' },
  { value: 'CUSTOM', label: 'Custom' },
];

const priorities: { value: TaskPriority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

export default function TaskForm({ userId, scheduledDate, onTaskCreated, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'WORK' as TaskCategory,
    customCategory: '',
    priority: 'MEDIUM' as TaskPriority,
    estimatedDuration: 30,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a task name');
      return;
    }

    if (formData.category === 'CUSTOM' && !formData.customCategory.trim()) {
      alert('Please enter a custom category name');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...formData,
          customCategory: formData.category === 'CUSTOM' ? formData.customCategory : null,
          scheduledDate: scheduledDate.toISOString(),
        }),
      });

      if (res.ok) {
        const newTask = await res.json();
        onTaskCreated(newTask);
      } else {
        const error = await res.json();
        alert('Failed to create task: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-primary-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Add New Task</h3>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Morning workout"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as TaskCategory })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {categories.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Category */}
        {formData.category === 'CUSTOM' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Category Name *
            </label>
            <input
              type="text"
              value={formData.customCategory}
              onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
              placeholder="e.g., Hobby, Project"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        )}

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {priorities.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData({ ...formData, priority: value })}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  formData.priority === value
                    ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Duration (minutes) *
          </label>
          <input
            type="number"
            value={formData.estimatedDuration}
            onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 0 })}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
