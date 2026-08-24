import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import SettingsModal from './SettingsModal';

export default function Layout({ children, onNavigate, currentPage }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        onNavigate={onNavigate} 
        currentPage={currentPage}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopBar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          onOpenSettings={() => setSettingsOpen(true)}
        />
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Settings Modal (BYOK) */}
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </div>
  );
}