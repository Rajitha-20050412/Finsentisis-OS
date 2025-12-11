
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Scale, 
  FileText, 
  CheckSquare, 
  MessageSquareText, 
  ShieldAlert, 
  Settings, 
  Search,
  Bell,
  User,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../utils';
import { UserProfile } from '../types';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full p-3 rounded-lg transition-all duration-200 group relative",
      active 
        ? "bg-brand-500/10 text-brand-400 border-l-4 border-brand-500" 
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
      collapsed ? "justify-center" : "space-x-3"
    )}
  >
    <Icon size={20} />
    {!collapsed && <span className="font-medium text-sm">{label}</span>}
    {collapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs text-slate-200 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
        {label}
      </div>
    )}
  </button>
);

interface SidebarProps {
  activePage: string;
  setPage: (p: string) => void;
  userProfile: UserProfile | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setPage, userProfile }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "h-screen bg-slate-950 border-r border-slate-800 flex flex-col transition-all duration-300 z-50",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Finsentsis</span>
          </div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
             <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-slate-500 hover:text-white hidden lg:block">
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <NavItem icon={LayoutDashboard} label="Dashboard" active={activePage === 'dashboard'} onClick={() => setPage('dashboard')} collapsed={collapsed} />
        <NavItem icon={Search} label="RegIntel" active={activePage === 'regintel'} onClick={() => setPage('regintel')} collapsed={collapsed} />
        <NavItem icon={FileText} label="Policy Studio" active={activePage === 'policy'} onClick={() => setPage('policy')} collapsed={collapsed} />
        <NavItem icon={CheckSquare} label="Workflows" active={activePage === 'workflows'} onClick={() => setPage('workflows')} collapsed={collapsed} />
        <NavItem icon={MessageSquareText} label="Copilot" active={activePage === 'copilot'} onClick={() => setPage('copilot')} collapsed={collapsed} />
        <NavItem icon={ShieldAlert} label="Audit Trail" active={activePage === 'audit'} onClick={() => setPage('audit')} collapsed={collapsed} />
      </div>

      <div className="p-3 border-t border-slate-800 space-y-1">
        <NavItem icon={Settings} label="Settings" active={activePage === 'settings'} onClick={() => setPage('settings')} collapsed={collapsed} />
        <button className={cn(
            "flex items-center w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 mt-2",
            collapsed ? "justify-center" : "space-x-3"
          )}>
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 text-xs font-bold text-slate-300">
               {userProfile ? userProfile.companyName.substring(0,2).toUpperCase() : 'AD'}
            </div>
            {!collapsed && (
              <div className="text-left overflow-hidden">
                <div className="text-sm font-medium text-slate-200 truncate">{userProfile ? userProfile.companyName : "Admin User"}</div>
                <div className="text-[10px] text-slate-500 uppercase truncate">{userProfile ? userProfile.sector : "Global Admin"}</div>
              </div>
            )}
        </button>
      </div>
    </div>
  );
};

export const Header = ({ title }: { title: string }) => {
  return (
    <header className="h-16 bg-slate-950/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
      
      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search regulations, tasks, policies..." 
            className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>
        
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export const PageContainer: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
  <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-200">
    <Header title={title} />
    <main className="flex-1 overflow-y-auto p-8 relative">
       {/* Background gradient effect */}
      <div className="absolute top-0 left-0 w-full h-96 bg-brand-900/10 -z-10 blur-3xl pointer-events-none" />
      {children}
    </main>
  </div>
);
