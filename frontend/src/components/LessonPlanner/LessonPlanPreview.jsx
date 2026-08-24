import { useState } from 'react';
import { Edit2, Check, ArrowLeft, Download, Wifi, WifiOff, Clock, Layers, Sparkles, BookOpen } from 'lucide-react';

export default function LessonPlanPreview({ lessonPlan, onBack }) {
  const [currentPlan, setCurrentPlan] = useState(lessonPlan.lesson_plan);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const startEditing = (index) => {
    setEditingIndex(index);
    const cls = currentPlan.classes[index];
    setEditForm({
      title: cls.title || '',
      topics: (cls.topics || []).join('\n'),
      teaching_strategies: (cls.teaching_strategies || []).join('\n'),
      activities: (cls.activities || []).join('\n'),
      assessment: cls.assessment || ''
    });
  };

  const handleSaveClass = async (index) => {
    setSaving(true);
    const updatedClass = {
      ...currentPlan.classes[index],
      title: editForm.title,
      topics: editForm.topics.split('\n').map(t => t.trim()).filter(Boolean),
      teaching_strategies: editForm.teaching_strategies.split('\n').map(s => s.trim()).filter(Boolean),
      activities: editForm.activities.split('\n').map(a => a.trim()).filter(Boolean),
      assessment: editForm.assessment
    };

    try {
      const res = await fetch(`http://localhost:8000/api/lesson-planner/${lessonPlan.lesson_plan_id || lessonPlan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_number: updatedClass.class_number,
          updated_content: updatedClass
        })
      });

      if (res.ok) {
        const newClasses = [...currentPlan.classes];
        newClasses[index] = updatedClass;
        setCurrentPlan(prev => ({ ...prev, classes: newClasses }));
        setEditingIndex(null);
      } else {
        alert('Failed to save changes');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating class');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Generator
        </button>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            lessonPlan.offline 
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            {lessonPlan.offline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            {lessonPlan.offline ? 'Offline Mode (Ollama)' : 'Online Mode (Gemini)'}
          </span>
        </div>
      </div>

      {/* Overview Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen className="w-40 h-40 text-purple-400" />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
          {currentPlan.title || `Lesson Plan: ${lessonPlan.topic}`}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Layers className="w-3.5 h-3.5 text-purple-400" /> Grade {lessonPlan.grade_level}
          </span>
          <span className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> {currentPlan.classes?.length || lessonPlan.number_of_classes} Sessions
          </span>
          <span className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> {lessonPlan.minutes_per_class} mins / class
          </span>
        </div>
      </div>

      {/* Class Sessions List */}
      <div className="space-y-4">
        {currentPlan.classes?.map((cls, idx) => {
          const isEditing = editingIndex === idx;

          return (
            <div 
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6 transition-all hover:border-slate-700 shadow-md"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                    {cls.class_number}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {cls.title}
                  </h3>
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => startEditing(idx)}
                    className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                  >
                    <Edit2 className="w-4 h-4" /> Edit Class
                  </button>
                ) : (
                  <button
                    onClick={() => handleSaveClass(idx)}
                    disabled={saving}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold shadow-md"
                  >
                    <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Class'}
                  </button>
                )}
              </div>

              {!isEditing ? (
                /* Display View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                  {cls.topics && cls.topics.length > 0 && (
                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                      <div className="font-semibold text-purple-300 uppercase tracking-wider text-[10px] mb-2">Topics & Concepts</div>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {cls.topics.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  )}

                  {cls.teaching_strategies && cls.teaching_strategies.length > 0 && (
                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                      <div className="font-semibold text-indigo-300 uppercase tracking-wider text-[10px] mb-2">Teaching Strategies</div>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {cls.teaching_strategies.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}

                  {cls.activities && cls.activities.length > 0 && (
                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                      <div className="font-semibold text-emerald-300 uppercase tracking-wider text-[10px] mb-2">Interactive Activities</div>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {cls.activities.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                  )}

                  {cls.assessment && (
                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                      <div className="font-semibold text-amber-300 uppercase tracking-wider text-[10px] mb-2">Formative Assessment</div>
                      <p className="text-slate-300 leading-relaxed">{cls.assessment}</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Edit Mode */
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Class Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Topics (one per line)</label>
                      <textarea
                        rows={3}
                        value={editForm.topics}
                        onChange={(e) => setEditForm({ ...editForm, topics: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Strategies (one per line)</label>
                      <textarea
                        rows={3}
                        value={editForm.teaching_strategies}
                        onChange={(e) => setEditForm({ ...editForm, teaching_strategies: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Activities (one per line)</label>
                      <textarea
                        rows={3}
                        value={editForm.activities}
                        onChange={(e) => setEditForm({ ...editForm, activities: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Assessment Method</label>
                      <textarea
                        rows={3}
                        value={editForm.assessment}
                        onChange={(e) => setEditForm({ ...editForm, assessment: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
