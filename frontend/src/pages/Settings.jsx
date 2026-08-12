import { Moon, Sun, Trash2, Info } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);

  const handleClearCache = () => {
    localStorage.clear();
    alert('Cache cleared');
  };

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold text-white">Settings</h1>

      {/* Theme Toggle */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Dark Mode</h3>
            <p className="text-gray-400 text-sm">Toggle dark/light theme</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            {darkMode ? 'Dark' : 'Light'}
          </button>
        </div>
      </div>

      {/* Clear Cache */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Cache</h3>
            <p className="text-gray-400 text-sm">Clear local cache and data</p>
          </div>
          <button
            onClick={handleClearCache}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Trash2 size={18} />
            Clear
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Info size={24} className="text-blue-400" />
          <h3 className="text-lg font-semibold text-white">About Sahayak</h3>
        </div>
        <div className="space-y-2 text-gray-400 text-sm">
          <p><span className="text-white">Version:</span> 0.1.0</p>
          <p><span className="text-white">Status:</span> Beta</p>
          <p><span className="text-white">Mode:</span> Offline-first</p>
        </div>
      </div>
    </div>
  );
}