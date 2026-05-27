import React, { useState } from 'react';
import { useAppStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { calculateTargetCalories } from '../../utils/calc';
import { Goal, Gender, ActivityLevel } from '../../types';

export default function ProfileSettingsModal({ onClose }: { onClose: () => void }) {
  const { currentUser, updateUser, changePassword } = useAppStore();
  if (!currentUser) return null;

  const [goal, setGoal] = useState<Goal>(currentUser.goal || 'maintain');
  const [gender, setGender] = useState<Gender>(currentUser.gender || 'male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(currentUser.activityLevel || 'medium');
  const [height, setHeight] = useState<number | ''>(currentUser.height || '');
  const [age, setAge] = useState<number | ''>(currentUser.age || '');
  
  const [newPassword, setNewPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  const handleSave = () => {
    const updates = {
      goal,
      gender,
      activityLevel,
      height: height !== '' ? Number(height) : undefined,
      age: age !== '' ? Number(age) : undefined,
    };
    
    // Attempt auto calculation if data is sufficient
    const newTarget = calculateTargetCalories({
      ...currentUser,
      ...updates
    });

    updateUser({
      ...updates,
      targetCalories: newTarget
    });

    onClose();
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      setPassError('パスワードは6文字以上で入力してください。');
      return;
    }
    try {
      setPassError('');
      await changePassword(newPassword);
      await updateUser({ rawPassword: newPassword });
      setPassSuccess(true);
      setNewPassword('');
      setTimeout(() => setPassSuccess(false), 3000);
    } catch (e: any) {
      setPassError('パスワード変更に失敗しました。再ログインが必要な場合があります。');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-sm max-h-[90vh] flex flex-col shadow-xl">
        <CardHeader className="pb-3 flex-shrink-0 flex flex-row items-center justify-between border-b border-gray-100">
          <CardTitle>プロフィールと目標設定</CardTitle>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900">×</button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pt-4 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">性別</label>
            <div className="flex space-x-2">
              <button 
                onClick={() => setGender('male')}
                className={`flex-1 py-2 border rounded-md text-sm transition-colors ${gender === 'male' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}
              >男性</button>
              <button 
                onClick={() => setGender('female')}
                className={`flex-1 py-2 border rounded-md text-sm transition-colors ${gender === 'female' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}
              >女性</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">年齢</label>
              <input type="number" value={age} onChange={e => setAge(Number(e.target.value) || '')} className="w-full border border-gray-200 rounded p-2 text-sm focus:border-gray-900 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">身長 (cm)</label>
              <input type="number" value={height} onChange={e => setHeight(Number(e.target.value) || '')} className="w-full border border-gray-200 rounded p-2 text-sm focus:border-gray-900 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">日常の運動量</label>
            <select value={activityLevel} onChange={e => setActivityLevel(e.target.value as ActivityLevel)} className="w-full border border-gray-200 rounded p-2 text-sm focus:border-gray-900 outline-none bg-white">
              <option value="low">低い (デスクワーク等)</option>
              <option value="medium">普通 (立ち仕事や軽い運動)</option>
              <option value="high">高い (肉体労働や激しい運動)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">設定目標</label>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setGoal('cut')} className={`py-2 border rounded-md text-sm transition-colors ${goal === 'cut' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}>減量</button>
              <button onClick={() => setGoal('maintain')} className={`py-2 border rounded-md text-sm transition-colors ${goal === 'maintain' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}>維持</button>
              <button onClick={() => setGoal('bulk')} className={`py-2 border rounded-md text-sm transition-colors ${goal === 'bulk' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}>増量</button>
            </div>
          </div>

          <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            体重、身長、年齢、運動量をもとに目標摂取カロリーが自動計算されます。
          </p>

          <Button className="w-full mt-4" onClick={handleSave}>設定を保存する</Button>
        </CardContent>
      </Card>
    </div>
  );
}
