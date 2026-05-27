import React, { useState } from 'react';
import { useAppStore } from '../../store/useStore';
import { Users, Calendar as CalendarIcon, LogOut, Settings, ClipboardList } from 'lucide-react';
import MemberList from './MemberList';
import AdminDashboardView from './AdminDashboardView';
import goatLogo from '../../assets/images/goat_logo_1779718162447.png';

type AdminTab = 'dashboard' | 'members';

export default function AdminLayout() {
  const { logout } = useAppStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 space-x-3">
          <div className="h-8 w-8 rounded-md bg-gray-900 text-white flex items-center justify-center p-1">
            <img src={goatLogo} alt="Logo" className="w-full h-full object-contain filter invert" />
          </div>
          <span className="font-bold tracking-widest text-gray-900">GOAT ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<ClipboardList />} label="ダッシュボード" />
          <NavItem active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<Users />} label="会員管理" />
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={logout} className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors">
            <LogOut className="w-4 h-4 mr-3" />
            ログアウト
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-14 flex md:hidden items-center justify-between px-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-md bg-gray-900 text-white flex items-center justify-center p-0.5">
              <img src={goatLogo} alt="Logo" className="w-full h-full object-contain filter invert" />
            </div>
            <span className="font-bold tracking-widest text-gray-900">GOAT ADMIN</span>
          </div>
          <button onClick={logout} className="p-2 text-gray-500 hover:text-gray-900">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'dashboard' ? <AdminDashboardView /> : <MemberList />}
        </div>
        
        {/* Mobile Bottom Nav */}
        <nav className="md:hidden flex h-16 border-t border-gray-200 bg-white">
          <button onClick={() => setActiveTab('dashboard')} className={`flex-1 flex flex-col items-center justify-center space-y-1 ${activeTab === 'dashboard' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            <ClipboardList className="w-5 h-5" />
            <span className="text-[10px]">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('members')} className={`flex-1 flex flex-col items-center justify-center space-y-1 ${activeTab === 'members' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            <Users className="w-5 h-5" />
            <span className="text-[10px]">Members</span>
          </button>
        </nav>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-md text-sm transition-colors ${active ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      <div className="w-5 h-5 mr-3">{icon}</div>
      {label}
    </button>
  );
}
