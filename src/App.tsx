/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { AppProvider, useAppStore } from './store/useStore';
import LoginView from './components/auth/LoginView';
import MemberLayout from './components/member/MemberLayout';
import AdminLayout from './components/admin/AdminLayout';

function AppContent() {
  const { currentUser } = useAppStore();

  if (!currentUser) {
    return <LoginView />;
  }

  if (currentUser.role === 'admin') {
    return <AdminLayout />;
  }

  return <MemberLayout />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
