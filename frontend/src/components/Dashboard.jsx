// import { FileText, BookOpen, MessageSquare, Gamepad2 } from 'lucide-react';

// export default function Dashboard() {
//   return (
//     <div className="space-y-8">
//       {/* Search Bar */}
//       <div className="max-w-2xl">
//         <h1 className="text-3xl font-bold text-white mb-6">How can I help you today?</h1>
//         <input
//           type="text"
//           placeholder="Search or describe what you need..."
//           className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
//         />
//       </div>

//       {/* Feature Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <FeatureCard
//           icon={FileText}
//           title="Worksheet Generator"
//           description="Generate worksheets from textbook images"
//         />
//         <FeatureCard
//           icon={BookOpen}
//           title="Lesson Planner"
//           description="Create detailed lesson plans from syllabus"
//         />
//         <FeatureCard
//           icon={MessageSquare}
//           title="Q&A"
//           description="Ask questions and get instant answers"
//         />
//         <FeatureCard
//           icon={Gamepad2}
//           title="Game Zone"
//           description="Create engaging educational games"
//         />
//       </div>
//     </div>
//   );
// }

// function FeatureCard({ icon: Icon, title, description }) {
//   return (
//     <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-6 text-left transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20">
//       <Icon size={32} className="text-blue-400 mb-4" />
//       <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
//       <p className="text-gray-400 text-sm">{description}</p>
//     </button>
//   );
// }













import { FileText, BookOpen, MessageSquare, Gamepad2, ChevronRight } from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2">
            How can I help you today?
          </h1>
          <p className="text-gray-400 text-lg">
            Choose a feature to get started, or search for something specific.
          </p>
        </div>

        {/* Search Bar */}
        <div className="pt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search or describe what you need..."
              className="w-full px-6 py-4 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-300 mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <FeatureCard
            icon={FileText}
            title="Worksheet Generator"
            description="Upload textbook images and auto-generate worksheets with different difficulty levels"
            color="blue"
          />
          <FeatureCard
            icon={BookOpen}
            title="Lesson Planner"
            description="Create detailed, classroom-ready lesson plans from your syllabus"
            color="purple"
          />
          <FeatureCard
            icon={MessageSquare}
            title="Q&A Assistant"
            description="Ask teaching questions and get instant, intelligent answers"
            onClick={() => onNavigate('qa')}
            color="green"
          />
          <FeatureCard
            icon={Gamepad2}
            title="Game Zone"
            description="Generate interactive educational games and quizzes for students"
            color="orange"

          />

        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">💡 Quick Tips</h3>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>• All features work offline. Your data is stored locally.</li>
          <li>• When online, results are enhanced with cloud AI for better quality.</li>
          <li>• No prompting required – just upload, select options, and generate.</li>
        </ul>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description,onClick = () => {}, color }) {
  const colorClasses = {
    blue: 'hover:border-blue-500 hover:shadow-blue-500/20',
    purple: 'hover:border-purple-500 hover:shadow-purple-500/20',
    green: 'hover:border-green-500 hover:shadow-green-500/20',
    orange: 'hover:border-orange-500 hover:shadow-orange-500/20',
  };

  const iconColors = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
  };

  return (
    <button 
    onClick={onClick}
    className={`group bg-gray-800 border border-gray-700 rounded-xl p-6 text-left transition-all hover:shadow-2xl ${colorClasses[color]}`}
  >
    {/* <button className={`group bg-gray-800 border border-gray-700 rounded-xl p-6 text-left transition-all hover:shadow-2xl ${colorClasses[color]}`}> */}
      <Icon size={40} className={`${iconColors[color]} mb-4 group-hover:scale-110 transition-transform`} />
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      <div className="mt-4 flex items-center text-gray-400 text-sm group-hover:text-white transition-colors">
        Get Started <ChevronRight size={16} className="ml-2" />
      </div>
    </button>
  );
}