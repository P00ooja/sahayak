import { Menu, Settings, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TopBar({ onMenuClick }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="bg-gray-800 text-white border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="hover:bg-gray-700 p-2 rounded-lg">
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold">Sahayak</h2>
      </div>

      <div className="flex items-center gap-4">
        {isOnline ? (
          <div className="flex items-center gap-2 text-green-400">
            <Wifi size={18} />
            <span className="text-sm">Online</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-400">
            <WifiOff size={18} />
            <span className="text-sm">Offline</span>
          </div>
        )}

        <button className="hover:bg-gray-700 p-2 rounded-lg">
          <Settings size={24} />
        </button>
      </div>
    </div>
  );
}