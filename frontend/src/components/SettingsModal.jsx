import { useState, useEffect } from 'react';
import { Key, ExternalLink, CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [settingsStatus, setSettingsStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/settings');
      const data = await res.json();
      setSettingsStatus(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSave = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setMessage(null);

    try {
      const res = await fetch('http://localhost:8000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ custom_gemini_api_key: apiKey.trim() })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: apiKey ? 'Custom Gemini API Key verified & saved successfully!' : 'Reset to Default Key configuration.' });
        setApiKey('');
        fetchSettings();
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to verify key.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error connecting to backend server.' });
    } finally {
      setVerifying(false);
    }
  };

  const handleClearCustomKey = async () => {
    setVerifying(true);
    setMessage(null);
    try {
      const res = await fetch('http://localhost:8000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ custom_gemini_api_key: '' })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Custom key removed. Reverted to default key.' });
        fetchSettings();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to clear key.' });
    } finally {
      setVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">App Settings</h2>
              <p className="text-xs text-slate-400">Manage online AI configurations & Gemini API Key</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Status */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Current Active Status</div>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-400" /> Loading configuration...
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-sm font-medium text-slate-200">
                    {settingsStatus?.has_custom_key 
                      ? `Custom API Key Active (${settingsStatus.masked_custom_key})` 
                      : 'Default App API Key Active'}
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {settingsStatus?.has_custom_key 
                      ? 'Using your custom Gemini key for all online responses' 
                      : 'Using bundled free key. Enter your key below if you hit limits.'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Online Ready
              </span>
            </div>
          )}
        </div>

        {/* BYOK Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">
              Use Your Own Gemini API Key (BYOK)
            </label>
            <p className="text-xs text-slate-400 mb-3">
              Google provides Gemini API keys 100% free of charge. You can generate your own key and paste it below.
            </p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium mb-4 underline underline-offset-4"
            >
              Get a Free Gemini API Key from Google AI Studio <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <form onSubmit={handleVerifyAndSave} className="space-y-4">
            <div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={settingsStatus?.has_custom_key ? "Enter new API Key to replace current..." : "Paste AIzaSy... API Key here"}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-colors"
              />
            </div>

            {message && (
              <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                <span>{message.text}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={verifying || !apiKey.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying & Saving...
                  </>
                ) : (
                  'Verify & Save Key'
                )}
              </button>

              {settingsStatus?.has_custom_key && (
                <button
                  type="button"
                  onClick={handleClearCustomKey}
                  disabled={verifying}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition-colors"
                >
                  Remove Key
                </button>
              )}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
