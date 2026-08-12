// import { Home, FileText, BookOpen, Settings } from 'lucide-react';

// export default function Sidebar({ open }) {
//   return (
//     <div className={`bg-gray-800 text-white w-64 transition-all duration-300 ${!open ? '-translate-x-full' : ''}`}>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold">Sahayak</h1>
//       </div>

//       <nav className="space-y-2 px-4">
//         <NavItem icon={Home} label="Home" />
//         <NavItem icon={FileText} label="Recent Files" comingSoon />
//         <NavItem icon={BookOpen} label="Saved Worksheets" comingSoon />
//         <NavItem icon={Settings} label="Settings" />
//       </nav>
//     </div>
//   );
// }

// function NavItem({ icon: Icon, label, comingSoon }) {
//   return (
//     <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors">
//       <Icon size={20} />
//       <span>{label}</span>
//       {comingSoon && <span className="text-xs text-gray-400 ml-auto">Soon</span>}
//     </button>
//   );
// }














import { Home, FileText, BookOpen, Settings, X } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({ open }) {
  const [activeItem, setActiveItem] = useState('home');

  return (
    <div className={`fixed lg:static bg-gray-800 text-white h-screen w-64 transform lg:transform-none transition-transform duration-300 z-40 ${!open ? '-translate-x-full' : ''}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Sahayak
            </h1>
            <p className="text-xs text-gray-400 mt-1">Teaching Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        <NavItem
          icon={Home}
          label="Home"
          id="home"
          active={activeItem === 'home'}
          onClick={() => setActiveItem('home')}
        />
        <NavItem
          icon={FileText}
          label="Recent Files"
          id="recent"
          active={activeItem === 'recent'}
          comingSoon
          onClick={() => setActiveItem('recent')}
        />
        <NavItem
          icon={BookOpen}
          label="Saved Worksheets"
          id="saved"
          active={activeItem === 'saved'}
          comingSoon
          onClick={() => setActiveItem('saved')}
        />
        <NavItem
          icon={Settings}
          label="Settings"
          id="settings"
          active={activeItem === 'settings'}
          onClick={() => setActiveItem('settings')}
        />
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 text-center">v0.1.0 Beta</p>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, id, active, comingSoon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-700'
      } ${comingSoon ? 'opacity-60 cursor-not-allowed' : ''}`}
      disabled={comingSoon}
    >
      <Icon size={20} />
      <span className="flex-1 text-left">{label}</span>
      {comingSoon && <span className="text-xs text-gray-400">Soon</span>}
    </button>
  );
}