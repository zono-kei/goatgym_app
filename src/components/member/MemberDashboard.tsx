import React, { useMemo, useState } from 'react';
import { useAppStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingDown } from 'lucide-react';
import goatLogo from '../../assets/images/goat_logo_1779718162447.png';

type ChartType = 'weight' | 'bodyFatPercentage' | 'subcutaneousFatPercentage' | 'skeletalMuscle' | 'basalMetabolicRate';

const chartLabels: Record<ChartType, string> = {
  weight: '体重 (kg)',
  bodyFatPercentage: '体脂肪率 (%)',
  subcutaneousFatPercentage: '皮下脂肪率 (%)',
  skeletalMuscle: '骨格筋',
  basalMetabolicRate: '基礎代謝量 (kcal)'
};

export default function MemberDashboard() {
  const { currentUser, weights } = useAppStore();
  const [activeChart, setActiveChart] = useState<ChartType>('weight');

  const userWeights = useMemo(() => {
    return weights
      .filter(w => w.userId === currentUser?.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14); // Last 14 records
  }, [weights, currentUser]);

  const latestRecord = userWeights[userWeights.length - 1];
  const prevRecord = userWeights[userWeights.length - 2];
  
  const latestWeight = latestRecord?.weight;
  const prevWeight = prevRecord?.weight;
  const weightDiff = latestWeight && prevWeight ? (latestWeight - prevWeight).toFixed(1) : '0.0';
  const isDown = parseFloat(weightDiff) <= 0;

  const getMetricValue = (record: any, type: ChartType) => {
    return record?.[type];
  };

  const getDiffAndTrend = (type: ChartType) => {
    const latest = getMetricValue(latestRecord, type);
    const prev = getMetricValue(prevRecord, type);
    if (latest === undefined || prev === undefined) return null;
    const diff = (latest - prev).toFixed(1);
    const isDown = parseFloat(diff) <= 0;
    return { diff, isDown };
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Hello, {currentUser?.name}</h1>
        <p className="text-gray-500 text-sm">今日も最高のトレーニングにしましょう。</p>
      </div>

      {/* Membership Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 text-white shadow-lg p-5 flex flex-col justify-between h-48 border border-gray-800">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 opacity-10">
          <img src={goatLogo} alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-xs font-medium tracking-widest text-gray-400">MEMBERSHIP CARD</p>
            <h2 className="text-lg font-bold tracking-widest mt-1">GOAT PERSONAL GYM</h2>
          </div>
          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-inner p-1">
             <img src={goatLogo} alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xl font-medium tracking-wide mb-1">{currentUser?.name}</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">MEMBER ID</p>
              <p className="text-sm font-mono tracking-widest text-gray-300">{currentUser?.memberId || currentUser?.id.substring(0, 8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">PLAN</p>
              <p className="text-sm font-medium text-gray-300">{currentUser?.contractPlan || 'STANDARD'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body Composition Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { id: 'weight', label: '体重 (kg)', unit: 'kg' },
          { id: 'bodyFatPercentage', label: '体脂肪率 (%)', unit: '%' },
          { id: 'subcutaneousFatPercentage', label: '皮下脂肪率 (%)', unit: '%' },
          { id: 'skeletalMuscle', label: '骨格筋', unit: '' },
          { id: 'basalMetabolicRate', label: '基礎代謝量', unit: 'kcal' },
        ].map((metric) => {
          const type = metric.id as ChartType;
          const val = getMetricValue(latestRecord, type);
          const trend = getDiffAndTrend(type);
          const isActive = activeChart === type;

          return (
            <Card 
              key={type}
              className={`cursor-pointer transition-all ${isActive ? 'border-gray-900 ring-1 ring-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400 shadow-sm'}`}
              onClick={() => setActiveChart(type)}
            >
              <CardContent className="p-3 flex flex-col justify-between h-full space-y-1">
                <div className={`text-[10px] font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                  {metric.label}
                </div>
                <div className="flex items-end space-x-1">
                  <span className={`text-xl font-bold font-mono ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                    {val !== undefined ? typeof val === 'number' && val % 1 !== 0 ? val.toFixed(1) : val : '--'}
                  </span>
                  {metric.unit && <span className="text-[10px] font-medium text-gray-500 pb-1">{metric.unit}</span>}
                </div>
                {trend && (
                  <div className={`text-[10px] font-medium flex items-center ${trend.isDown ? (type === 'weight' || type.includes('Fat') ? 'text-emerald-600' : 'text-rose-600') : (type === 'weight' || type.includes('Fat') ? 'text-rose-600' : 'text-emerald-600')}`}>
                    {trend.isDown ? <TrendingDown className="w-2.5 h-2.5 mr-0.5" /> : '↑'} {Math.abs(parseFloat(trend.diff))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-gray-900">{chartLabels[activeChart]}推移</CardTitle>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">過去14回</span>
        </CardHeader>
        <CardContent className="p-4 pt-0 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userWeights} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={10} 
                domain={['dataMin - 1', 'dataMax + 1']} 
                tickFormatter={(val) => val % 1 === 0 ? val.toString() : val.toFixed(1)} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827' }}
                itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                labelStyle={{ color: '#6b7280', fontSize: 12, marginBottom: '4px' }}
                formatter={(value: number) => [value % 1 === 0 ? value : value.toFixed(1), chartLabels[activeChart]]}
              />
              <Line type="monotone" dataKey={activeChart} stroke="#111827" strokeWidth={2} dot={{ r: 3, fill: '#111827' }} activeDot={{ r: 5 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
