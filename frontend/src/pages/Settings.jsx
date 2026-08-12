// import { Moon, Sun, Trash2, Info } from 'lucide-react';
// import { useState } from 'react';

// export default function SettingsPage() {
//   const [darkMode, setDarkMode] = useState(true);

//   const handleClearCache = () => {
//     localStorage.clear();
//     alert('Cache cleared');
//   };

//   return (
//     <div className="max-w-2xl space-y-8">
//       <h1 className="text-3xl font-bold text-white">Settings</h1>

//       {/* Theme Toggle */}
//       <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold text-white">Dark Mode</h3>
//             <p className="text-gray-400 text-sm">Toggle dark/light theme</p>
//           </div>
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//           >
//             {darkMode ? <Moon size={18} /> : <Sun size={18} />}
//             {darkMode ? 'Dark' : 'Light'}
//           </button>
//         </div>
//       </div>

//       {/* Clear Cache */}
//       <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold text-white">Cache</h3>
//             <p className="text-gray-400 text-sm">Clear local cache and data</p>
//           </div>
//           <button
//             onClick={handleClearCache}
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//           >
//             <Trash2 size={18} />
//             Clear
//           </button>
//         </div>
//       </div>

//       {/* About */}
//       <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
//         <div className="flex items-center gap-3 mb-4">
//           <Info size={24} className="text-blue-400" />
//           <h3 className="text-lg font-semibold text-white">About Sahayak</h3>
//         </div>
//         <div className="space-y-2 text-gray-400 text-sm">
//           <p><span className="text-white">Version:</span> 0.1.0</p>
//           <p><span className="text-white">Status:</span> Beta</p>
//           <p><span className="text-white">Mode:</span> Offline-first</p>
//         </div>
//       </div>
//     </div>
//   );
// } 

















import { Moon, Sun, Trash2, Info, Shield, Database } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);

  const handleClearCache = () => {
    if (window.confirm('Are you sure? This will delete all local data.')) {
      localStorage.clear();
      alert('Cache cleared successfully');
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-5xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Customize your Sahayak experience</p>
      </div>

      {/* Theme Section */}
      <SettingSection
        icon={darkMode ? Moon : Sun}
        title="Theme"
        description="Choose your preferred color theme"
      >
        <div className="flex gap-2">
          <button
            onClick={() => setDarkMode(true)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              darkMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Moon size={18} />
            Dark
          </button>
          <button
            onClick={() => setDarkMode(false)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              !darkMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Sun size={18} />
            Light
          </button>
        </div>
      </SettingSection>

      {/* Storage Section */}
      <SettingSection
        icon={Database}
        title="Storage"
        description="Manage local data and cache"
      >
        <div className="space-y-3">
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-sm text-gray-300">
              Local Cache: <span className="text-blue-400 font-semibold">2.4 MB</span>
            </p>
          </div>
          <button
            onClick={handleClearCache}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Trash2 size={18} />
            Clear Cache
          </button>
        </div>
      </SettingSection>

      {/* Privacy Section */}
      <SettingSection
        icon={Shield}
        title="Privacy & Data"
        description="Your data stays on your device"
      >
        <div className="space-y-3 text-sm text-gray-300">
          <p>✓ No data sent to servers without permission</p>
          <p>✓ Offline mode uses local processing only</p>
          <p>✓ Online mode uses Gemini API (see terms)</p>
        </div>
      </SettingSection>

      {/* About Section */}
      <SettingSection
        icon={Info}
        title="About Sahayak"
        description="Version and system information"
      >
        <div className="space-y-3 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Version</span>
            <span className="text-white font-semibold">0.1.0 Beta</span>
          </div>
          <div className="flex justify-between">
            <span>Platform</span>
            <span className="text-white font-semibold">Desktop (Tauri)</span>
          </div>
          <div className="flex justify-between">
            <span>Mode</span>
            <span className="text-white font-semibold">Offline-First</span>
          </div>
          <div className="flex justify-between">
            <span>License</span>
            <span className="text-white font-semibold">MIT</span>
          </div>
        </div>
      </SettingSection>
    </div>
  );
}

function SettingSection({ icon: Icon, title, description, children }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Icon size={28} className="text-blue-400 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}