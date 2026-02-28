import React from 'react';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';

interface Props {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 pb-20 pt-16">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
