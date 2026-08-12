import { FileText, BookOpen, MessageSquare, Gamepad2 } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">How can I help you today?</h1>
        <input
          type="text"
          placeholder="Search or describe what you need..."
          className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard
          icon={FileText}
          title="Worksheet Generator"
          description="Generate worksheets from textbook images"
        />
        <FeatureCard
          icon={BookOpen}
          title="Lesson Planner"
          description="Create detailed lesson plans from syllabus"
        />
        <FeatureCard
          icon={MessageSquare}
          title="Q&A"
          description="Ask questions and get instant answers"
        />
        <FeatureCard
          icon={Gamepad2}
          title="Game Zone"
          description="Create engaging educational games"
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-6 text-left transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20">
      <Icon size={32} className="text-blue-400 mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </button>
  );
}