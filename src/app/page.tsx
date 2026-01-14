'use client';

import { useEffect, useState } from 'react';
import DailyDashboard from '@/components/DailyDashboard';
import HistoryView from '@/components/HistoryView';
import { LayoutDashboard, Calendar } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // In a real app, this would come from authentication
    // For demo, we'll use the demo user
    const fetchDemoUser = async () => {
      try {
        const res = await fetch('/api/users/demo');
        const data = await res.json();
        if (data.id) {
          setUserId(data.id);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchDemoUser();
  }, []);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-safe py-4">
          <h1 className="text-2xl font-bold text-gray-900">Digital Routine</h1>
          <p className="text-sm text-gray-600 mt-1">Build discipline through tracking</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container-safe">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'today'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Today
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              History
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container-safe py-6">
        {activeTab === 'today' && <DailyDashboard userId={userId} />}
        {activeTab === 'history' && <HistoryView userId={userId} />}
      </main>
    </div>
  );
}
