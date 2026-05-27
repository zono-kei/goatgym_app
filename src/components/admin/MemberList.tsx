import React, { useState } from 'react';
import { useAppStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Search, ChevronRight, UserPlus, Trash2 } from 'lucide-react';
import MemberProfileModal from './MemberProfileModal';
import { User } from '../../types';

export default function MemberList() {
  const { users, adminCreateUser, deleteUser } = useAppStore();
  const members = users.filter(u => u.role === 'member');
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const filteredMembers = members.filter(m => m.name.includes(search) || m.email.includes(search));

  const handleAddMember = async () => {
    if(!newName || !newEmail || newPassword.length < 6) return;
    setIsCreating(true);
    setError('');
    
    try {
      const formattedEmail = newEmail.includes('@') ? newEmail : `${newEmail}@goat-hp.local`;
      const newUser: Omit<User, 'id'> = {
        name: newName,
        memberId: newMemberId,
        email: formattedEmail,
        role: 'member',
        tickets: 0,
        goal: 'maintain',
        targetCalories: 2000,
      };
      await adminCreateUser(formattedEmail, newPassword, newUser);
      setShowAddModal(false);
      setNewName(''); setNewEmail(''); setNewPassword(''); setNewMemberId('');
    } catch (e: any) {
      console.error(e);
      setError('ユーザーの作成に失敗しました: ' + (e.message || ''));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(confirm('本当に削除しますか？この操作は取り消せません。')) {
      deleteUser(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">会員管理</h1>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="名前かメールで検索..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-md py-2 pl-9 pr-4 text-sm text-gray-900 focus:border-gray-900 outline-none"
            />
          </div>
          <Button size="icon" className="shrink-0" onClick={() => setShowAddModal(true)}>
            <UserPlus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-medium">会員番号</th>
                <th className="px-6 py-4 font-medium">名前</th>
                <th className="px-6 py-4 font-medium">プラン</th>
                <th className="px-6 py-4 font-medium">ログインID</th>
                <th className="px-6 py-4 font-medium">パスワード</th>
                <th className="px-6 py-4 font-medium">残回数券</th>
                <th className="px-6 py-4 text-right">アクション</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map(member => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setSelectedMember(member)}>
                  <td className="px-6 py-4 font-medium text-gray-500 font-mono">{member.memberId || '-'}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{member.name}</td>
                  <td className="px-6 py-4 text-gray-500">{member.contractPlan || '未設定'}</td>
                  <td className="px-6 py-4 text-gray-500">{member.email.replace('@goat-hp.local', '')}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{member.rawPassword || '-'}</td>
                  <td className="px-6 py-4"><span className="text-gray-900 font-bold">{member.tickets || 0}</span> 回</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end space-x-1">
                    <Button variant="ghost" size="icon" className="text-rose-500 opacity-50 hover:opacity-100 hover:bg-rose-50" onClick={(e) => handleDelete(e, member.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 group-hover:text-gray-900">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">会員が見つかりません。</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedMember && (
        <MemberProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
           <Card className="w-full max-w-sm shadow-xl">
             <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between pb-4">
               <CardTitle>新規会員の追加</CardTitle>
               <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-900">×</button>
             </CardHeader>
             <CardContent className="pt-6 space-y-4">
               {error && <p className="text-xs text-rose-500">{error}</p>}
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">お名前</label>
                 <input type="text" value={newName} onChange={e=>setNewName(e.target.value)} className="w-full bg-white border border-gray-200 rounded p-2 text-gray-900 focus:border-gray-900 outline-none" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">会員番号 (任意)</label>
                 <input type="text" value={newMemberId} onChange={e=>setNewMemberId(e.target.value)} placeholder="例: 1001" className="w-full bg-white border border-gray-200 rounded p-2 text-gray-900 focus:border-gray-900 outline-none font-mono" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">ログインID</label>
                 <input type="text" value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="例: yamada" className="w-full bg-white border border-gray-200 rounded p-2 text-gray-900 focus:border-gray-900 outline-none" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-700">初期パスワード（6文字以上）</label>
                 <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full bg-white border border-gray-200 rounded p-2 text-gray-900 focus:border-gray-900 outline-none" />
               </div>
               <div className="pt-4 flex space-x-2">
                 <Button variant="outline" className="w-full" onClick={() => setShowAddModal(false)} disabled={isCreating}>キャンセル</Button>
                 <Button className="w-full" onClick={handleAddMember} disabled={!newName || !newEmail || newPassword.length < 6 || isCreating}>
                   {isCreating ? '追加中...' : '追加'}
                 </Button>
               </div>
             </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
}
