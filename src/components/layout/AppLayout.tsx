import React from 'react';
// import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Calendar, ListTodo } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const { user, logout, signIn } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: '主題分類', path: '/', icon: LayoutGrid },
    { name: '艾森豪矩陣', path: '/matrix', icon: ListTodo },
    { name: '每日計畫', path: '/daily-plan', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b px-4 py-3 flex justify-between items-center bg-card sticky top-0 z-50">
        <h1 className="text-xl font-bold tracking-tight">🌾 DailyGrain</h1>

        {/* 暫時隱藏 Auth 功能 */}
        {/* <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.displayName}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                登出
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={signIn}>登入</Button>
          )}
        </div> */}
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar for larger screens */}
        <aside className="w-64 border-r hidden md:flex flex-col p-4 gap-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button 
                variant={location.pathname === item.path ? 'secondary' : 'ghost'} 
                className="w-full justify-start"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Button>
            </Link>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:pl-4 sm:pr-0 md:pl-6">
          {children}
        </main>
      </div>

      {/* Bottom Navigation for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card flex justify-around p-2 z-50">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 p-2">
            <item.icon className={`h-5 w-5 ${location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-[10px] ${location.pathname === item.path ? 'font-bold' : 'text-muted-foreground'}`}>
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
