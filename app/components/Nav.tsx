"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from './functions';
import "../styles/nav.css";

interface Chat {
  id: string;
  title: string;
  created_at: string;
  chart_type: string;
  data: string;
  url: string;
  website_data: string;
}

const Nav = () => {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const handleNewChat = () => {
    setSelectedChatId(null);
    window.dispatchEvent(new CustomEvent('newChatSelected'));
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    const selectedChat = chats.find(chat => chat.id === chatId);
    if (selectedChat) {
      window.dispatchEvent(new CustomEvent('chatSelected', { 
        detail: { 
          chatId,
          title: selectedChat.title,
          data: selectedChat.data,
          chartType: selectedChat.chart_type,
          url: selectedChat.url || '',
          websiteData: selectedChat.website_data || ''
        } 
      }));
    }
  };

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chats');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch chats');
      }
      
      const { chats } = await response.json();
      setChats(chats);
    } catch (err) {
      setError('Failed to load chats');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats?chatId=${chatId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete chat');
      }
      
      setChats(chats.filter(chat => chat.id !== chatId));
    } catch (err) {
      setError('Failed to delete chat');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <nav className="bg-gray-900 min-h-screen p-4 flex flex-col">
      <div className="flex-1 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Previous Chats</h2>
          <button
            onClick={handleNewChat}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white w-24 rounded-lg text-sm transition-colors"
          >
            New Chat
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`bg-gray-800 rounded-lg p-3 hover:bg-gray-700 w-80 transition-colors group cursor-pointer ${
                  selectedChatId === chat.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate max-w-[200px]">{chat.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-gray-400 text-sm">{formatDate(chat.created_at)}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(chat.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 ml-2 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {chats.length === 0 && (
              <p className="text-gray-400 text-sm text-center">No previous chats</p>
            )}
          </div>
        )}
      </div>

      <button 
        onClick={logout}
        className="mt-auto bg-red-600 hover:bg-red-700 text-white w-32 rounded-lg transition-colors"
      >
        Logout
      </button>
    </nav>
  );
};

export default Nav;