// import { Menu, Settings, Wifi, WifiOff } from 'lucide-react';
// import { useState, useEffect } from 'react';

// export default function TopBar({ onMenuClick }) {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   return (
//     <div className="bg-gray-800 text-white border-b border-gray-700 px-6 py-4 flex justify-between items-center">
//       <div className="flex items-center gap-4">
//         <button onClick={onMenuClick} className="hover:bg-gray-700 p-2 rounded-lg">
//           <Menu size={24} />
//         </button>
//         <h2 className="text-xl font-semibold">Sahayak</h2>
//       </div>

//       <div className="flex items-center gap-4">
//         {isOnline ? (
//           <div className="flex items-center gap-2 text-green-400">
//             <Wifi size={18} />
//             <span className="text-sm">Online</span>
//           </div>
//         ) : (
//           <div className="flex items-center gap-2 text-red-400">
//             <WifiOff size={18} />
//             <span className="text-sm">Offline</span>
//           </div>
//         )}

//         <button className="hover:bg-gray-700 p-2 rounded-lg">
//           <Settings size={24} />
//         </button>
//       </div>
//     </div>
//   );
// }














import { Menu, Settings, Wifi, WifiOff, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TopBar({ onMenuClick, onOpenSettings }) {

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showSettings, setShowSettings] = useState(false);

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
    <div className="bg-gray-800 text-white border-b border-gray-700 px-6 py-4 flex justify-between items-center sticky top-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden hover:bg-gray-700 p-2 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Center: Status Info */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-full">
          {isOnline ? (
            <>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Online</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Offline Mode</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Settings */}
      <div className="flex items-center gap-4">
        <button className="hover:bg-gray-700 p-2 rounded-lg relative">
          <Bell size={24} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={onOpenSettings}
            className="hover:bg-gray-700 p-2 rounded-lg text-gray-300 hover:text-white transition-colors"
            title="App Settings (Gemini API Key)"
          >
            <Settings size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}