import React from 'react';
import { useAppStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

export default function AdminDashboardView() {
  const { users } = useAppStore();
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">ダッシュボード</h1>
        <div className="text-sm border border-gray-200 bg-white px-4 py-2 rounded-md font-medium text-gray-700">
          {today.split('-').join('/')}  (本日)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-6 flex flex-col justify-between space-y-2">
            <p className="text-sm text-gray-500 font-medium">総会員数</p>
            <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.role === 'member').length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
