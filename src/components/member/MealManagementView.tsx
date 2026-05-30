import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { FOOD_DATABASE } from '../../data';
import { calculatePFC } from '../../utils/pfc';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import ProfileSettingsModal from './ProfileSettingsModal';
import DietAdvice from './DietAdvice';
import zonoLogo from '../../zono.png';

export default function MealManagementView() {
  const { currentUser, meals, addMeal, customFoods, addCustomFood } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  
  const todayMeals = meals.filter(m => m.userId === currentUser?.id && m.date === selectedDate);
  
  const totalCalories = todayMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = todayMeals.reduce((acc, m) => acc + m.protein, 0);
  const totalFat = todayMeals.reduce((acc, m) => acc + m.fat, 0);
  const totalCarbs = todayMeals.reduce((acc, m) => acc + m.carbs, 0);

  const targetCalories = currentUser?.targetCalories || 2000;
  const pfcTargets = calculatePFC(targetCalories, currentUser?.goal || 'maintain');

  const pfcGraphData = [
    { name: 'Protein', value: totalProtein * 4, fill: '#ef4444' },
    { name: 'Fat', value: totalFat * 9, fill: '#eab308' },
    { name: 'Carbs', value: totalCarbs * 4, fill: '#3b82f6' },
  ].filter(d => d.value > 0);
  if (pfcGraphData.length === 0) pfcGraphData.push({ name: 'Empty', value: 1, fill: '#333' });

  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showCustomFoodForm, setShowCustomFoodForm] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState<typeof FOOD_DATABASE[0] | null>(null);
  const [amount, setAmount] = useState<number>(100);

  // Custom Food Form State
  const [showSettings, setShowSettings] = useState(false);
  const [cfName, setCfName] = useState('');
  const [cfCalories, setCfCalories] = useState('');
  const [cfProtein, setCfProtein] = useState('');
  const [cfFat, setCfFat] = useState('');
  const [cfCarbs, setCfCarbs] = useState('');

  const handleAddMeal = () => {
    if (!selectedFood || !currentUser) return;
    const ratio = amount / 100;
    addMeal({
      id: `m_${Date.now()}`,
      userId: currentUser.id,
      date: selectedDate,
      foodName: selectedFood.name,
      amount,
      calories: Math.round(selectedFood.calories * ratio),
      protein: Math.round(selectedFood.protein * ratio * 10) / 10,
      fat: Math.round(selectedFood.fat * ratio * 10) / 10,
      carbs: Math.round(selectedFood.carbs * ratio * 10) / 10,
      type: 'lunch' // simplify for prototype
    });
    setShowAddMeal(false);
    setSelectedFood(null);
    setAmount(100);
    setFoodSearch('');
  };

  const handleSaveCustomFood = () => {
    if (!cfName || !cfCalories) return;
    addCustomFood({
      name: cfName,
      calories: Number(cfCalories),
      protein: Number(cfProtein || 0),
      fat: Number(cfFat || 0),
      carbs: Number(cfCarbs || 0),
    });
    setCfName(''); setCfCalories(''); setCfProtein(''); setCfFat(''); setCfCarbs('');
    setShowCustomFoodForm(false);
    setFoodSearch(cfName);
  };

  const allFoods = [...customFoods, ...FOOD_DATABASE];
  const filteredFoods = allFoods.filter(f => f.name.includes(foodSearch));

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">食事管理</h1>
        <input 
          type="date" 
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="bg-white border border-gray-200 rounded px-2 py-1 text-sm text-gray-900 outline-none focus:border-gray-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Graph */}
        <Card className="col-span-1 rounded-full border-none bg-transparent aspect-square shadow-none border-0 relative flex flex-col items-center justify-center p-0 overflow-hidden w-full">
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Kcal</span>
            <span className="text-3xl font-bold font-mono text-gray-900 leading-none my-0.5">{Math.round(totalCalories)}</span>
            <span className="text-xs text-gray-500 font-medium">/ {targetCalories}</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pfcGraphData}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="90%"
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {pfcGraphData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* PFC Targets */}
        <div className="flex flex-col justify-center space-y-4">
          <PFCBar label="Protein" value={totalProtein} target={pfcTargets.protein} color="bg-rose-500" />
          <PFCBar label="Fat" value={totalFat} target={pfcTargets.fat} color="bg-amber-400" />
          <PFCBar label="Carbs" value={totalCarbs} target={pfcTargets.carbs} color="bg-blue-500" />
        </div>
      </div>

      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-xl border border-gray-200 text-sm">
        <div className="text-gray-600">設定目標: <span className="text-gray-900 font-bold ml-2">{currentUser?.goal === 'cut' ? '減量 (Cut)' : currentUser?.goal === 'bulk' ? '増量 (Bulk)' : '維持 (Maintain)'}</span></div>
        <button className="text-gray-900 font-medium hover:underline border border-gray-300 bg-white px-3 py-1 rounded-full text-xs shadow-sm" onClick={() => setShowSettings(true)}>変更</button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-lg font-bold text-gray-900">食事履歴</h2>
          <Button size="sm" onClick={() => setShowAddMeal(true)}>＋ 追加</Button>
        </div>

        {todayMeals.length > 0 ? (
          <div className="space-y-3">
            {todayMeals.map(meal => (
              <Card key={meal.id} className="border-gray-200 shadow-sm">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{meal.foodName} <span className="text-xs font-normal text-gray-500 ml-1">{meal.amount}g</span></h3>
                    <div className="text-xs text-gray-500 mt-1 flex space-x-3">
                      <span>P: {meal.protein}g</span>
                      <span>F: {meal.fat}g</span>
                      <span>C: {meal.carbs}g</span>
                    </div>
                  </div>
                  <div className="font-bold text-lg text-gray-900">{meal.calories} <span className="text-xs font-normal text-gray-500">kcal</span></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 border border-dashed border-gray-300 rounded-xl bg-white">
            まだ記録がありません。
          </div>
        )}
      </div>

      <DietAdvice />

      {showSettings && <ProfileSettingsModal onClose={() => setShowSettings(false)} />}

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm max-h-[90vh] flex flex-col shadow-xl">
            <CardHeader className="pb-3 flex-shrink-0 flex flex-row items-center justify-between border-b border-gray-100">
              <CardTitle>{showCustomFoodForm ? 'オリジナル食品の登録' : '食事を追加'}</CardTitle>
              <button onClick={() => {setShowAddMeal(false); setShowCustomFoodForm(false);}} className="text-gray-400 hover:text-gray-900">×</button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pt-4 space-y-4">
              {showCustomFoodForm ? (
                <div className="space-y-4">
                   <div className="space-y-2">
                    <label className="text-xs text-gray-500">食品名</label>
                    <input type="text" value={cfName} onChange={e => setCfName(e.target.value)} className="w-full bg-white border border-gray-200 rounded p-2 text-sm text-gray-900 focus:border-gray-900 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500">100gあたりのカロリー (kcal)</label>
                    <input type="number" value={cfCalories} onChange={e => setCfCalories(e.target.value)} className="w-full bg-white border border-gray-200 rounded p-2 text-sm text-gray-900 focus:border-gray-900 outline-none" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500">P: タンパク質 (g)</label>
                      <input type="number" value={cfProtein} onChange={e => setCfProtein(e.target.value)} className="w-full bg-white border border-gray-200 rounded p-2 text-sm text-gray-900 focus:border-gray-900 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs text-gray-500">F: 脂質 (g)</label>
                       <input type="number" value={cfFat} onChange={e => setCfFat(e.target.value)} className="w-full bg-white border border-gray-200 rounded p-2 text-sm text-gray-900 focus:border-gray-900 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs text-gray-500">C: 炭水化物 (g)</label>
                       <input type="number" value={cfCarbs} onChange={e => setCfCarbs(e.target.value)} className="w-full bg-white border border-gray-200 rounded p-2 text-sm text-gray-900 focus:border-gray-900 outline-none" />
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-6">
                    <Button variant="outline" className="w-full" onClick={() => setShowCustomFoodForm(false)}>戻る</Button>
                    <Button className="w-full" onClick={handleSaveCustomFood} disabled={!cfName || !cfCalories}>登録</Button>
                  </div>
                </div>
              ) : !selectedFood ? (
                <>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="食材を検索..." 
                      value={foodSearch}
                      onChange={e => setFoodSearch(e.target.value)}
                      className="flex-1 w-full bg-white border border-gray-200 rounded p-2 text-sm text-gray-900 focus:border-gray-900 outline-none"
                    />
                  </div>
                  <Button variant="outline" className="w-full text-xs box-border" onClick={() => setShowCustomFoodForm(true)}>＋ マイ食品を登録</Button>
                  <div className="max-h-60 overflow-y-auto space-y-1 mt-2">
                    {filteredFoods.slice(0, 20).map((f, i) => (
                      <button 
                        key={f.name + i}
                        onClick={() => setSelectedFood(f)}
                        className="w-full text-left p-3 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded flex justify-between items-center transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700">{f.name}</span>
                        <span className="text-xs text-gray-400">{f.calories} kcal</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold border-b border-gray-100 pb-3 text-gray-900">
                    {selectedFood.name}
                    <button onClick={() => setSelectedFood(null)} className="text-xs text-gray-500 font-medium border border-gray-200 px-2 py-1 rounded hover:bg-gray-50">選び直す</button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">摂取量 (g)</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={e => setAmount(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded p-2 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <div className="text-gray-500 mb-1">Kcal</div>
                      <div className="font-bold text-gray-900 text-base">{Math.round(selectedFood.calories * (amount/100))}</div>
                    </div>
                    <div>
                      <div className="text-rose-500 mb-1">P</div>
                      <div className="font-bold text-gray-900 text-base">{(selectedFood.protein * (amount/100)).toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-amber-500 mb-1">F</div>
                      <div className="font-bold text-gray-900 text-base">{(selectedFood.fat * (amount/100)).toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-blue-500 mb-1">C</div>
                      <div className="font-bold text-gray-900 text-base">{(selectedFood.carbs * (amount/100)).toFixed(1)}</div>
                    </div>
                  </div>
                  <Button className="w-full mt-4 h-11" onClick={handleAddMeal}>食事を保存する</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col items-center justify-center mt-12 mb-8 opacity-90 transition-opacity duration-500">
        <div className="relative mb-3 flex flex-col items-center">
          <div className="bg-white text-gray-800 text-sm py-2 px-4 rounded-full shadow-lg border border-gray-100 font-bold z-10 whitespace-nowrap mb-2 relative animate-bounce-slow">
            食事もしっかり管理しよう！🥗
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45"></div>
          </div>
          <img
            src={zonoLogo}
            alt="Zono"
            className="h-24 md:h-32 object-contain drop-shadow-xl"
          />
        </div>
        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-2 bg-white/80 px-4 py-1 rounded-full">
          Powered By Zono
        </p>
      </div>
    </div>
  );
}

function PFCBar({ label, value, target, color }: { label: string, value: number, target: number, color: string }) {
  const percent = Math.min(100, Math.round((value / target) * 100)) || 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-bold text-gray-700">{label}</span>
        <span className="text-gray-400"><span className={value > target ? 'text-rose-600 font-bold' : 'text-gray-900 font-bold'}>{Math.round(value)}</span> / {target}g</span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  )
}
