import { Home, FileText, BookOpen, Settings } from 'lucide-react';

export default function Sidebar({ open }) {
  return (
    <div className={`bg-gray-800 text-white w-64 transition-all duration-300 ${!open ? '-translate-x-full' : ''}`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Sahayak</h1>
      </div>

      <nav className="space-y-2 px-4">
        <NavItem icon={Home} label="Home" />
        <NavItem icon={FileText} label="Recent Files" comingSoon />
        <NavItem icon={BookOpen} label="Saved Worksheets" comingSoon />
        <NavItem icon={Settings} label="Settings" />
      </nav>
    </div>
  );
}

function NavItem({ icon: Icon, label, comingSoon }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors">
      <Icon size={20} />
      <span>{label}</span>
      {comingSoon && <span className="text-xs text-gray-400 ml-auto">Soon</span>}
    </button>
  );
}