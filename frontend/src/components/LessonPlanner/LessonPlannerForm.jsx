import { useState } from 'react';
import { BookOpen, Sparkles, Clock, Calendar, Globe, AlertCircle } from 'lucide-react';

export default function LessonPlannerForm({ onGenerate, loading }) {
  const [formData, setFormData] = useState({
    topic: '',
    grade_level: 5,
    number_of_classes: 5,
    minutes_per_class: 45,
    language: 'en'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(value) || name === 'language' || name === 'topic' ? value : parseInt(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      alert('Please enter a topic or chapter name');
      return;
    }
    onGenerate(formData);
  };

  const totalMinutes = (formData.number_of_classes || 0) * (formData.minutes_per_class || 0);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" /> AI Curriculum Generator
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
          Lesson Planner
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Generate structured, classroom-ready multi-class lesson plans with teaching strategies, interactive activities, and formative assessments.
        </p>
      </div>

      {/* Form Card */}
      <form 
        onSubmit={handleSubmit}
        className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl space-y-6"
      >
        {/* Topic Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            Topic or Chapter Name <span className="text-purple-400">*</span>
          </label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="e.g. Chapter 5: Photosynthesis & Plant Respiration"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl text-white placeholder-slate-500 outline-none transition-colors text-sm"
            required
          />
        </div>

        {/* Grid Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Grade Level */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Grade Level
            </label>
            <select
              name="grade_level"
              value={formData.grade_level}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl text-white text-sm outline-none transition-colors"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                <option key={g} value={g}>Grade {g}</option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Language
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl text-white text-sm outline-none transition-colors"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          {/* Number of Classes */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-400" /> Number of Classes
            </label>
            <input
              type="number"
              name="number_of_classes"
              value={formData.number_of_classes}
              onChange={handleChange}
              min="1"
              max="20"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl text-white text-sm outline-none transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1">Total periods for this topic (1-20)</p>
          </div>

          {/* Minutes per Class */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" /> Minutes per Class
            </label>
            <input
              type="number"
              name="minutes_per_class"
              value={formData.minutes_per_class}
              onChange={handleChange}
              min="15"
              max="120"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl text-white text-sm outline-none transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1">Standard period length in minutes</p>
          </div>
        </div>

        {/* Calculated Info Badge */}
        <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-400">
          <span>Estimated Total Teaching Duration:</span>
          <span className="font-semibold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
            {totalMinutes} Total Minutes ({formData.number_of_classes} sessions × {formData.minutes_per_class} mins)
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2.5 text-sm"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating Lesson Plan...
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4" /> Generate Lesson Plan
            </>
          )}
        </button>
      </form>
    </div>
  );
}
