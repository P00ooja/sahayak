import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatBox({ onSend, loading }) {
  const [question, setQuestion] = useState('');

  const handleSend = () => {
    if (question.trim()) {
      onSend(question);
      setQuestion('');
    }
  };

  return (
    <div className="border-t border-gray-700 p-4 bg-gray-800">
      <div className="flex gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !question.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}