import { Plus, MessageSquare } from 'lucide-react';

export default function ChatHistory({ chats, currentChat, onSelectChat, onNewChat }) {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {chats.length === 0 ? (
          <p className="text-gray-400 text-sm text-center mt-4">No chats yet</p>
        ) : (
          chats.map((chat, idx) => (
            <button
              key={chat.chat_id || idx}
              onClick={() => onSelectChat(chat.chat_id)}
              className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                currentChat === chat.chat_id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare size={16} />
                <span className="truncate">{chat.title}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}