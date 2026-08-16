import { Plus, MessageSquare, Pin } from 'lucide-react';

export default function ChatHistory({ chats, currentChat, onSelectChat, onNewChat, onToggleSave }) {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 flex items-center justify-center gap-2 font-medium transition-colors"
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
          chats.map((chat, idx) => {
            const chatId = chat.chat_id || chat.id;
            const isSelected = currentChat === chatId;
            const isSaved = Boolean(chat.is_saved);

            return (
              <div
                key={chatId || idx}
                onClick={() => onSelectChat(chatId)}
                className={`group flex items-center justify-between p-3 rounded-lg mb-1.5 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                  <MessageSquare size={16} className="shrink-0" />
                  <span className="truncate text-sm">{chat.title}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleSave) onToggleSave(chatId);
                  }}
                  title={isSaved ? "Saved (click to unpin)" : "Save/Pin chat"}
                  className={`p-1 rounded transition-colors ${
                    isSaved
                      ? 'text-yellow-400 hover:text-yellow-300'
                      : 'text-gray-500 opacity-0 group-hover:opacity-100 hover:text-gray-200'
                  }`}
                >
                  <Pin size={14} className={isSaved ? "fill-yellow-400" : ""} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}