
import React, { useState } from 'react';
import { Sidebar } from './components/Shared';
import Dashboard from './pages/Dashboard';
import RegIntel from './pages/RegIntel';
import Workflows from './pages/Workflows';
import Copilot from './pages/Copilot';
import Audit from './pages/Audit';
import Policy from './pages/Policy';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import { UserProfile } from './types';

type AuthState = 'unauthenticated' | 'onboarding' | 'authenticated';

const App = () => {
  const [authState, setAuthState] = useState<AuthState>('unauthenticated');
  const [activePage, setActivePage] = useState('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleLoginSuccess = () => {
    setAuthState('onboarding');
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setAuthState('authenticated');
  };

  const renderPage = () => {
    switch(activePage) {
      case 'dashboard': return <Dashboard userProfile={userProfile} />;
      case 'regintel': return <RegIntel userProfile={userProfile} />;
      case 'workflows': return <Workflows userProfile={userProfile} />;
      case 'copilot': return <Copilot />;
      case 'audit': return <Audit />;
      case 'policy': return <Policy />;
      default: return <Dashboard userProfile={userProfile} />;
    }
  };

  if (authState === 'unauthenticated') {
    return <Login onLogin={handleLoginSuccess} />;
  }

  if (authState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-200">
      <Sidebar activePage={activePage} setPage={setActivePage} userProfile={userProfile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
