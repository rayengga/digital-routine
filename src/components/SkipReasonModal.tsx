'use client';

import { useState } from 'react';
import { SkipReason } from '@prisma/client';
import { X } from 'lucide-react';

interface SkipReasonModalProps {
  onConfirm: (reason: SkipReason, explanation?: string) => void;
  onCancel: () => void;
}

const skipReasons: { value: SkipReason; label: string }[] = [
  { value: 'LACK_OF_DISCIPLINE', label: 'Lack of Discipline' },
  { value: 'BAD_PLANNING', label: 'Bad Planning' },
  { value: 'FATIGUE', label: 'Fatigue' },
  { value: 'DISTRACTION', label: 'Distraction' },
  { value: 'UNREALISTIC_TASK', label: 'Unrealistic Task' },
  { value: 'OTHER', label: 'Other' },
];

export default function SkipReasonModal({ onConfirm, onCancel }: SkipReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<SkipReason | null>(null);
  const [explanation, setExplanation] = useState('');

  const handleConfirm = () => {
    if (!selectedReason && !explanation.trim()) {
      alert('Please select a reason or provide an explanation');
      return;
    }

    onConfirm(selectedReason || 'OTHER', explanation.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Why didn&apos;t you complete this task?</h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Reasons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a reason:
            </label>
            <div className="space-y-2">
              {skipReasons.map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedReason === value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="skipReason"
                    value={value}
                    checked={selectedReason === value}
                    onChange={(e) => setSelectedReason(e.target.value as SkipReason)}
                    className="mr-3 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-900">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Text Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or provide your own explanation:
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain why you couldn't complete this task..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          <p className="text-xs text-gray-500">
            * You must select a reason or provide an explanation to skip this task
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Skip Task
          </button>
        </div>
      </div>
    </div>
  );
}
