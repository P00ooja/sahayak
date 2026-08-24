import { useState, useEffect } from 'react';
import LessonPlannerForm from '../components/LessonPlanner/LessonPlannerForm';
import LessonPlanPreview from '../components/LessonPlanner/LessonPlanPreview';
import { History, BookOpen, Trash2, ArrowRight } from 'lucide-react';

export default function LessonPlannerPage() {
  const [step, setStep] = useState('form'); // 'form' | 'preview'
  const [lessonPlan, setLessonPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/lesson-planner/history');
      const data = await res.json();
      setHistory(data.lesson_plans || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleGenerate = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/lesson-planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setLessonPlan(data);
        setStep('preview');
        fetchHistory();
      } else {
        alert(data.detail || 'Error generating lesson plan');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedPlan = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/lesson-planner/${id}`);
      const data = await res.json();
      if (res.ok) {
        setLessonPlan({
          lesson_plan_id: data.id,
          topic: data.topic,
          grade_level: data.grade_level,
          number_of_classes: data.number_of_classes,
          minutes_per_class: data.minutes_per_class,
          lesson_plan: data.current_plan,
          model: data.model,
          offline: data.offline
        });
        setStep('preview');
        setShowHistory(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this lesson plan?')) return;
    try {
      await fetch(`http://localhost:8000/api/lesson-planner/${id}`, { method: 'DELETE' });
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pb-12 px-4 md:px-8">
      {/* Top Controls Bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between py-4 mb-4 border-b border-slate-800/60">
        <button
          onClick={() => { setStep('form'); setLessonPlan(null); }}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          + New Lesson Plan
        </button>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 transition-colors"
        >
          <History className="w-3.5 h-3.5" /> Past Plans ({history.length})
        </button>
      </div>

      {/* History Drawer */}
      {showHistory && (
        <div className="max-w-4xl mx-auto mb-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" /> Saved Lesson Plans
          </h3>
          {history.length === 0 ? (
            <p className="text-xs text-slate-500">No saved lesson plans yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              {history.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => loadSavedPlan(plan.id)}
                  className="p-3 bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="truncate pr-2">
                    <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-purple-300">
                      {plan.topic}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Grade {plan.grade_level} • {plan.number_of_classes} Sessions • {plan.offline ? 'Offline' : 'Online'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => deletePlan(e, plan.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Content Step Router */}
      {step === 'form' && (
        <LessonPlannerForm onGenerate={handleGenerate} loading={loading} />
      )}

      {step === 'preview' && lessonPlan && (
        <LessonPlanPreview 
          lessonPlan={lessonPlan} 
          onBack={() => setStep('form')} 
        />
      )}
    </div>
  );
}
