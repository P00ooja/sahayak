// import { useState, useEffect } from 'react';
// import { Send, Plus, MessageSquare } from 'lucide-react';
// import ChatBox from '../components/QAComponents/ChatBox';
// import ChatHistory from '../components/QAComponents/ChatHistory';

// export default function QAPage() {
//   const [chats, setChats] = useState([]);
//   const [currentChat, setCurrentChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     loadChats();
//   }, []);

//   const loadChats = async () => {
//     try {
//       const res = await fetch('http://localhost:8000/api/qa/chats');
//       const data = await res.json();
//       setChats(data.chats || []);
//       if (data.chats.length > 0) {
//         selectChat(data.chats[0].chat_id);
//       }
//     } catch (error) {
//       console.error('Error loading chats:', error);
//     }
//   };

//   const selectChat = async (chatId) => {
//     try {
//       const res = await fetch(`http://localhost:8000/api/qa/history/${chatId}`);
//       const data = await res.json();
//       setCurrentChat(chatId);
//       setMessages(data.messages || []);
//     } catch (error) {
//       console.error('Error loading chat history:', error);
//     }
//   };

// //   const createNewChat = async () => {
// //     try {
// //       const res = await fetch('http://localhost:8000/api/qa/new-chat', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: '{}'
// //       });
// //       const data = await res.json();
// //       const newChat = { chat_id: data.chat_id, title: data.title };
// //       setChats([newChat, ...chats]);
// //       selectChat(data.chat_id);
// //     } catch (error) {
// //       console.error('Error creating chat:', error);
// //     }
// //   };

//   const createNewChat = async () => {
//     try {
//       console.log('Creating new chat...');
//       const res = await fetch('http://localhost:8000/api/qa/new-chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: '{}'
//       });
//       console.log('Response:', res.status, res.statusText);
//       const data = await res.json();
//       console.log('New chat data:', data);
//       const newChat = { chat_id: data.chat_id, title: data.title };
//     //   setChats([newChat, ...chats]);
//       setChats(prev => [newChat, ...prev]);
//       await selectChat(data.chat_id);

//       return data.chat_id;
     
//     } catch (error) {
//       console.error('Error creating chat:', error);
//     }
//   };

// //   const sendMessage = async (question) => {
// //     if (!currentChat) {
// //       await createNewChat();
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const res = await fetch('http://localhost:8000/api/qa/ask', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ chat_id: currentChat, question })
// //       });
// //       const data = await res.json();
// //       setMessages([...messages, {
// //         question: data.question,
// //         answer: data.answer,
// //         offline: data.offline,
// //         created_at: data.created_at
// //       }]);
// //     } catch (error) {
// //       console.error('Error sending message:', error);
// //     }
// //     setLoading(false);
// //   };


// const sendMessage = async (question) => {
//     let chatId = currentChat;
  
//     if (!chatId) {
//       chatId = await createNewChat();
//     }
  
//     setLoading(true);
  
//     try {
//       const res = await fetch("http://localhost:8000/api/qa/ask", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           chat_id: chatId,
//           question,
//         }),
//       });
  
//       const data = await res.json();
  
//       setMessages(prev => [
//         ...prev,
//         {
//           question: data.question,
//           answer: data.answer,
//           offline: data.offline,
//           created_at: data.created_at,
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-900">
//       {/* Sidebar */}
//       <ChatHistory 
//         chats={chats} 
//         currentChat={currentChat}
//         onSelectChat={selectChat}
//         onNewChat={createNewChat}
//       />

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           {messages.length === 0 ? (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center text-gray-400">
//                 <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
//                 <p>No messages yet. Ask a question to get started!</p>
//               </div>
//             </div>
//           ) : (
//             messages.map((msg, idx) => (
//               <div key={idx} className="space-y-3">
//                 <div className="flex justify-end">
//                   <div className="bg-blue-600 text-white rounded-lg p-3 max-w-md">
//                     {msg.question}
//                   </div>
//                 </div>
//                 <div className="flex justify-start">
//                   <div className="bg-gray-800 text-gray-100 rounded-lg p-3 max-w-md">
//                     <p>{msg.answer}</p>
//                     <p className="text-xs text-gray-400 mt-2">
//                       {msg.offline ? '📱 Offline' : '🌐 Online'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//           {loading && (
//             <div className="flex justify-start">
//               <div className="bg-gray-800 text-gray-400 rounded-lg p-3">
//                 Thinking...
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Input Area */}
//         <ChatBox onSend={sendMessage} loading={loading} />
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import ChatBox from '../components/QAComponents/ChatBox';
import ChatHistory from '../components/QAComponents/ChatHistory';

export default function QAPage() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/qa/chats');
      const data = await res.json();

      const chatList = data.chats || [];
      setChats(chatList);

      if (chatList.length > 0) {
        const savedChatId = localStorage.getItem('sahayak_current_chat');
        const exists = chatList.some(
          (c) => (c.chat_id || c.id) === savedChatId
        );
        const targetId = exists
          ? savedChatId
          : chatList[0].chat_id || chatList[0].id;
        await selectChat(targetId);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const selectChat = async (chatId) => {
    if (!chatId) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/qa/history/${chatId}`
      );

      if (!res.ok) {
        throw new Error(`Failed to load history (${res.status})`);
      }

      const data = await res.json();

      setCurrentChat(chatId);
      localStorage.setItem('sahayak_current_chat', chatId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const toggleSaveChat = async (chatId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/qa/chats/${chatId}/toggle-save`,
        {
          method: 'POST',
        }
      );
      if (!res.ok) throw new Error(`Failed to toggle save (${res.status})`);
      const data = await res.json();

      setChats((prev) =>
        prev.map((c) =>
          (c.chat_id || c.id) === chatId ? { ...c, is_saved: data.is_saved } : c
        )
      );
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/qa/new-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{}',
      });

      if (!res.ok) {
        throw new Error(`Failed to create chat (${res.status})`);
      }

      const data = await res.json();

      const newChat = {
        chat_id: data.chat_id,
        title: data.title,
        is_saved: false,
        created_at: data.created_at,
      };

      setChats((prev) => [newChat, ...prev]);
      await selectChat(data.chat_id);

      return data.chat_id;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  const sendMessage = async (question) => {
    let chatId = currentChat;

    if (!chatId) {
      chatId = await createNewChat();
      if (!chatId) {
        return;
      }
    }

    const tempMessage = {
      question: question,
      answer: null,
      offline: false,
      created_at: new Date().toISOString(),
      pending: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/qa/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          question,
        }),
      });

      if (!res.ok) {
        throw new Error(`Backend error (${res.status})`);
      }

      const data = await res.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.pending && msg.question === question
            ? {
                question: data.question,
                answer: data.answer,
                offline: data.offline,
                model: data.model,
                created_at: data.created_at,
                pending: false,
              }
            : msg
        )
      );

      // Refresh chat list to update title and sorting order
      const chatsRes = await fetch('http://localhost:8000/api/qa/chats');
      if (chatsRes.ok) {
        const chatsData = await chatsRes.json();
        setChats(chatsData.chats || []);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.pending && msg.question === question
            ? {
                question: question,
                answer: `Error: ${error.message || 'Failed to get response.'}`,
                offline: false,
                pending: false,
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <ChatHistory
        chats={chats}
        currentChat={currentChat}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
        onToggleSave={toggleSaveChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                <p>No messages yet. Ask a question to get started!</p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg p-3 max-w-md">
                    {msg.question}
                  </div>
                </div>

                {msg.answer && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-gray-100 rounded-lg p-3 max-w-md">
                      <p className="whitespace-pre-wrap">{msg.answer}</p>

                      <p className="text-xs text-gray-400 mt-2">
                        {msg.offline ? '📱 Offline' : '🌐 Online'} {msg.model ? `(${msg.model})` : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-400 rounded-lg p-3">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <ChatBox onSend={sendMessage} loading={loading} />
      </div>
    </div>
  );
}