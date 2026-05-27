import React, { useState, useEffect } from 'react';
import { Home, Calendar, Utensils, Settings, Bell } from 'lucide-react';
import MemberDashboard from './MemberDashboard';
import MealManagementView from './MealManagementView';
import { useAppStore } from '../../store/useStore';
import goatLogo from '../../assets/images/goat_logo_1779718162447.png';

type Tab = 'home' | 'meal';

export default function MemberLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { logout, currentUser } = useAppStore();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Mock periodic push notification for motivation
    const timer = setTimeout(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 15000); // show after 15 seconds for demo
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <MemberDashboard />;
      case 'meal': return <MealManagementView />;
      default: return <MemberDashboard />;
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-gray-50 text-gray-900 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-16 left-4 right-4 z-50 bg-white border border-gray-200 rounded-xl p-4 shadow-xl flex items-start space-x-3 transition-opacity animate-in fade-in slide-in-from-top-4">
          <div className="bg-yellow-100 p-2 rounded-full">
            <Bell className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900">GOAT サポート</h4>
            <p className="text-xs text-gray-500 mt-1">{currentUser?.name}さん、今日の食事は記録しましたか？理想のカラダは日々の積み重ねです！</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-md bg-gray-900 text-white flex items-center justify-center p-0.5">
            <img src={goatLogo} alt="Logo" className="w-full h-full object-contain filter invert" />
          </div>
          <span className="font-bold tracking-widest text-gray-900">GOAT</span>
        </div>
        <button onClick={logout} className="text-gray-400 hover:text-gray-900">
          <Settings className="h-5 w-5" />
        </button>
      </header>

      {/* Main Content Area - scrollable */}
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-20">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 pb-safe">
        <NavItem active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home />} label="HOME" />
        <NavItem active={activeTab === 'meal'} onClick={() => setActiveTab('meal')} icon={<Utensils />} label="MEAL" />
      </nav>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
    >
      <div className="h-5 w-5">{icon}</div>
      <span className="text-[10px] font-medium tracking-wider">{label}</span>
    </button>
  );
}
