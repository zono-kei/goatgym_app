import React, { useState } from 'react';
import { User, WeightRecord } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useStore';

export default function MemberProfileModal({ member, onClose }: { member: User, onClose: () => void }) {
  const { updateUserAdmin, trainings, addTraining, weights, addWeight, adminChangePassword } = useAppStore();
  const [tickets, setTickets] = useState(member.tickets || 0);
  const [contractPlan, setContractPlan] = useState(member.contractPlan || '');
  const [editMemberId, setEditMemberId] = useState(member.memberId || '');
  const [name, setName] = useState(member.name || '');
  const [activeTab, setActiveTab] = useState<'profile' | 'body' | 'memo'>('profile');
  const [newTraining, setNewTraining] = useState('');

  // Body Composition State
  const [bDate, setBDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bWeight, setBWeight] = useState<number | ''>('');
  const [bFat, setBFat] = useState<number | ''>('');
  const [bSubFat, setBSubFat] = useState<number | ''>('');
  const [bMuscle, setBMuscle] = useState<number | ''>('');
  const [bVisceral, setBVisceral] = useState<number | ''>('');
  const [bAge, setBAge] = useState<number | ''>('');
  const [bBmr, setBBmr] = useState<number | ''>('');

  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState('');

  const memberTrainings = trainings.filter(t => t.userId === member.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const memberBodies = weights.filter(w => w.userId === member.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSaveProfile = () => {
    updateUserAdmin(member.id, { contractPlan, memberId: editMemberId, tickets, name });
    onClose();
  };

  const handleAddTraining = () => {
    if(!newTraining.trim()) return;
    addTraining({
      id: `t_${Date.now()}`,
      userId: member.id,
      date: new Date().toISOString().split('T')[0],
      menu: newTraining
    });
    setNewTraining('');
  };

  const handleAddBodyComp = () => {
    if (bWeight === '') return;
    const bodyDate = bDate;
    addWeight({
      id: `w_${Date.now()}`,
      userId: member.id,
      date: bodyDate,
      weight: Number(bWeight),
      bodyFatPercentage: bFat !== '' ? Number(bFat) : undefined,
      subcutaneousFatPercentage: bSubFat !== '' ? Number(bSubFat) : undefined,
      skeletalMuscle: bMuscle !== '' ? Number(bMuscle) : undefined,
      visceralFatLevel: bVisceral !== '' ? Number(bVisceral) : undefined,
      bodyAge: bAge !== '' ? Number(bAge) : undefined,
      basalMetabolicRate: bBmr !== '' ? Number(bBmr) : undefined,
    });
    
    // update latest weight in user profile
    updateUserAdmin(member.id, { weight: Number(bWeight) });

    setBWeight(''); setBFat(''); setBSubFat(''); setBMuscle(''); setBVisceral(''); setBAge(''); setBBmr('');
    setBDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">{member.name} 様のカルテ</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900">×</button>
        </div>

        <div className="flex border-b border-gray-100 px-6 space-x-6 shrink-0 overflow-x-auto">
          <button 
            className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'profile' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('profile')}
          >
            プロフィール・プラン管理
          </button>
          <button 
            className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'body' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('body')}
          >
            体組成データ入力
          </button>
          <button 
            className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'memo' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('memo')}
          >
            メモ (管理者用)
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">お名前</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="例: 山田太郎"
                    className="w-full bg-white border border-gray-200 rounded-md p-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">ログインID</label>
                  <div className="text-sm border border-gray-200 bg-gray-50 p-2.5 rounded-md text-gray-700">{member.loginId || member.email.replace(/(_\d+)?@goat-hp\.local/, '').replace('@goat-hp.local', '')}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">会員番号</label>
                  <input 
                    type="text" 
                    value={editMemberId}
                    onChange={e => setEditMemberId(e.target.value)}
                    placeholder="例: 1001"
                    className="w-full bg-white border border-gray-200 rounded-md p-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">契約プラン</label>
                  <input 
                    type="text" 
                    value={contractPlan}
                    onChange={e => setContractPlan(e.target.value)}
                    placeholder="例: スタンダード月4プラン"
                    className="w-full bg-white border border-gray-200 rounded-md p-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">残り回数 (チケット)</label>
                  <input 
                    type="number" 
                    value={tickets}
                    onChange={e => setTickets(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-md p-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-sm font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="text-sm font-medium text-gray-900 block mb-2">パスワード管理</label>
                
                <div className="mb-4 bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-1">現在のパスワード (システム記録)</p>
                  <p className="font-mono text-gray-900">{member.rawPassword || '記録なし'}</p>
                  <p className="text-[10px] text-gray-500 mt-1">※ユーザー自身で変更済みの場合は一致しない可能性があります。</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500">管理者によるパスワード強制変更</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="password" 
                      placeholder="新しいパスワード(6文字以上)" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="flex-1 bg-white border border-gray-200 rounded p-2 text-sm focus:border-gray-900 outline-none"
                    />
                    <Button 
                      variant="outline"
                      disabled={newPassword.length < 6 || !member.rawPassword}
                      onClick={async () => {
                        setPasswordChangeStatus('変更中...');
                        try {
                          if (member.rawPassword) {
                            await adminChangePassword(member.email, member.rawPassword, newPassword, member.id);
                            setPasswordChangeStatus('完了しました。');
                            setNewPassword('');
                            setTimeout(() => setPasswordChangeStatus(''), 3000);
                          }
                        } catch (e) {
                          setPasswordChangeStatus('失敗: 記録された元のパスワードが正しくない可能性があります。');
                        }
                      }}
                    >変更</Button>
                  </div>
                  {passwordChangeStatus && <p className="text-xs text-blue-600 mt-1">{passwordChangeStatus}</p>}
                  {!member.rawPassword && <p className="text-[10px] text-rose-500 mt-1">※記録された元パスワードがないため、ここでは変更できません。</p>}
                </div>
              </div>

              <div className="pt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>キャンセル</Button>
                <Button onClick={handleSaveProfile}>保存して閉じる</Button>
              </div>
            </div>
          )}

          {activeTab === 'body' && (
            <div className="space-y-8">
              <Card className="bg-gray-50 border-gray-200 shadow-sm">
                <CardHeader className="pb-2 border-b border-gray-200">
                  <CardTitle className="text-sm text-gray-900">InBody / 体組成データ入力</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">測定日</label>
                    <input type="date" value={bDate} onChange={e=>setBDate(e.target.value)} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 focus:border-gray-900 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">体重 (kg)</label>
                    <input type="number" value={bWeight} onChange={e=>setBWeight(Number(e.target.value) || '')} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 focus:border-gray-900 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">体脂肪率 (%)</label>
                    <input type="number" value={bFat} onChange={e=>setBFat(Number(e.target.value) || '')} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 focus:border-gray-900 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">皮下脂肪率 (%)</label>
                    <input type="number" value={bSubFat} onChange={e=>setBSubFat(Number(e.target.value) || '')} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 focus:border-gray-900 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">骨格筋 (kg)</label>
                    <input type="number" value={bMuscle} onChange={e=>setBMuscle(Number(e.target.value) || '')} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 focus:border-gray-900 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">内臓脂肪レベル</label>
                    <input type="number" value={bVisceral} onChange={e=>setBVisceral(Number(e.target.value) || '')} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 focus:border-gray-900 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">体年齢 (歳)</label>
                    <input type="number" value={bAge} onChange={e=>setBAge(Number(e.target.value) || '')} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 focus:border-gray-900 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">基礎代謝量 (kcal)</label>
                    <input type="number" value={bBmr} onChange={e=>setBBmr(Number(e.target.value) || '')} className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 focus:border-gray-900 outline-none text-sm" />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full h-8 text-xs font-bold" onClick={handleAddBodyComp} disabled={bWeight === ''}>＋ 記録を追加</Button>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">体組成 履歴</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                      <tr>
                        <th className="px-3 py-3 font-medium whitespace-nowrap">測定日</th>
                        <th className="px-3 py-3 font-medium text-right">体重</th>
                        <th className="px-3 py-3 font-medium text-right">体脂肪率</th>
                        <th className="px-3 py-3 font-medium text-right">皮下脂肪</th>
                        <th className="px-3 py-3 font-medium text-right">骨格筋 (kg)</th>
                        <th className="px-3 py-3 font-medium text-right">内臓脂肪</th>
                        <th className="px-3 py-3 font-medium text-right">体年齢</th>
                        <th className="px-3 py-3 font-medium text-right">基礎代謝</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 hover:divide-gray-100">
                      {memberBodies.map(w => (
                        <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3 text-gray-600">{w.date}</td>
                          <td className="px-3 py-3 text-right bg-gray-50 font-bold text-gray-900">{Number(w.weight).toFixed(1)}kg</td>
                          <td className="px-3 py-3 text-right font-medium text-gray-900">{w.bodyFatPercentage ? `${w.bodyFatPercentage}%` : '-'}</td>
                          <td className="px-3 py-3 text-right text-gray-600">{w.subcutaneousFatPercentage ? `${w.subcutaneousFatPercentage}%` : '-'}</td>
                          <td className="px-3 py-3 text-right text-gray-600">{w.skeletalMuscle ? `${w.skeletalMuscle}kg` : '-'}</td>
                          <td className="px-3 py-3 text-right text-gray-600">{w.visceralFatLevel || '-'}</td>
                          <td className="px-3 py-3 text-right text-gray-600">{w.bodyAge ? `${w.bodyAge}歳` : '-'}</td>
                          <td className="px-3 py-3 text-right text-gray-600">{w.basalMetabolicRate ? `${w.basalMetabolicRate}kcal` : '-'}</td>
                        </tr>
                      ))}
                      {memberBodies.length === 0 && (
                        <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-500">データがありません</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'memo' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h3 className="text-sm font-medium mb-3 text-gray-900">管理者用メモを追加</h3>
                <textarea 
                  value={newTraining}
                  onChange={e => setNewTraining(e.target.value)}
                  placeholder="ユーザーに関する管理メモを入力..."
                  className="w-full h-24 bg-white border border-gray-200 rounded-md p-3 text-sm text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none resize-none"
                />
                <Button className="mt-4 w-full md:w-auto md:px-8" onClick={handleAddTraining} disabled={!newTraining.trim()}>
                  メモを追加する
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 text-gray-700">過去のメモ履歴</h3>
                {memberTrainings.length > 0 ? (
                  <div className="space-y-3">
                    {memberTrainings.map(t => (
                      <Card key={t.id} className="bg-white border-gray-200 shadow-sm">
                        <CardContent className="p-4 space-y-2">
                          <div className="text-xs text-gray-900 font-bold tracking-wider">{t.date}</div>
                          <div className="text-sm whitespace-pre-wrap text-gray-600 leading-relaxed">{t.menu}</div>
                        </CardContent>
                      </Card>
                    ))}
                 </div>
                ) : (
                  <div className="text-center py-8 border border-gray-200 rounded-xl border-dashed text-sm text-gray-500 bg-gray-50">履歴がありません</div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
