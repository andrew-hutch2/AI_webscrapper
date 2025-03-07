"use client"

import { JSX, useState, useEffect } from "react";
import "../styles/home.css"
import Chart from "./chart";
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// Initialize the Supabase client using our utility function
const supabase = createClient();

// Log the environment variables (without the actual values)
console.log('Supabase URL available:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Anon Key available:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Scraper(): JSX.Element {
  const router = useRouter();
  const [inputUrl, setInputUrl] = useState<string>("");
  const [data, setData] = useState("Enter a URL and click 'Scrape Website' to extract content. The scraped data will be displayed here and can be used to generate visualizations." as any);
  const [error, setError] = useState<string | null>(null);
  const [dropdown, setDropdown] = useState(true);
  const [chatbotWindow, setChatbotWindow] = useState("");
  const [chatbotData, setChatbotData] = useState("" as any);
  const [type, setType] = useState("bar");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    // Listen for chat selection events
    const handleChatSelected = (event: CustomEvent) => {
      const { chatId, title, data, chartType, url, websiteData } = event.detail;
      console.log('Chat selected:', { chatId, title, chartType, url, websiteData });
      
      setCurrentChatId(chatId);
      // Set the form data from the selected chat
      setChatbotWindow(title);
      setChatbotData(data);
      setType(chartType);
      
      // Set the URL and website data with proper null checks
      if (url) {
        console.log('Setting URL:', url);
        setInputUrl(url);
      }
      
      if (websiteData) {
        console.log('Setting website data:', websiteData);
        setData(websiteData);
      } else {
        setData("Enter a URL and click 'Scrape Website' to extract content. The scraped data will be displayed here and can be used to generate visualizations.");
      }
    };

    const handleNewChatSelected = () => {
      console.log('New chat selected');
      setCurrentChatId(null);
      // Reset form for new chat
      setInputUrl("");
      setData("Enter a URL and click 'Scrape Website' to extract content. The scraped data will be displayed here and can be used to generate visualizations.");
      setChatbotWindow("");
      setChatbotData("");
      setType("bar");
    };

    window.addEventListener('chatSelected', handleChatSelected as EventListener);
    window.addEventListener('newChatSelected', handleNewChatSelected as EventListener);

    return () => {
      window.removeEventListener('chatSelected', handleChatSelected as EventListener);
      window.removeEventListener('newChatSelected', handleNewChatSelected as EventListener);
    };
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        // First try to get the user directly
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('User error:', userError);
          return;
        }

        if (user) {
          console.log('User found directly:', user.id);
          setUserId(user.id);
          return;
        }

        // If no user, check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }

        if (session?.user) {
          console.log('User found from session:', session.user.id);
          setUserId(session.user.id);
        } else {
          console.log('No session or user found');
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          
          if (session?.user) {
            console.log('Setting userId from auth change:', session.user.id);
            setUserId(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out, clearing userId');
            setUserId(null);
            router.push('/login');
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error in getUser:', err);
      }
    };
    getUser();
  }, [router]);

  const handleScrape = async (): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/scrapper?url=${encodeURIComponent(inputUrl)}`);
      if (!response.ok) {
        const errorResponse = await response.json();
        setError(errorResponse.error || "Something went wrong.");
        return;
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError("Failed to fetch scraped data.");
    } finally {
      setIsLoading(false);
    }
  };

  const extractChartTitle = (jsonString: string): string => {
    try {
      const jsonData = JSON.parse(jsonString);
      // Try to get title from various possible locations in the JSON
      const title = jsonData.title || 
                   jsonData.chartTitle || 
                   jsonData.name || 
                   jsonData.chart?.title || 
                   'Untitled Chart';
      return title;
    } catch (err) {
      console.error('Error parsing JSON for title:', err);
      return 'Untitled Chart';
    }
  };

  const handleChatbot = async (): Promise<void> => {
    setError(null);
    setIsLoading(true);
    const message = {message: chatbotWindow + ": website data :  " + data, type: type};
    try {
      const response = await fetch(`/api/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        setError(errorResponse.error || "Something went wrong.");
        return;
      }

      const result = await response.json();
      setChatbotData(result.completion.choices[0].message.content);

      // Extract chart title from the JSON response
      const chartTitle = extractChartTitle(result.completion.choices[0].message.content);

      // Save the chat to Supabase
      if (userId) {
        console.log('Attempting to save chat with userId:', userId);
        const chatResponse = await fetch('/api/chats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: chartTitle,
            data: result.completion.choices[0].message.content,
            chartType: type,
            url: inputUrl,
            websiteData: data
          }),
        });

        if (!chatResponse.ok) {
          const errorData = await chatResponse.json();
          console.error('Failed to save chat:', errorData);
          setError('Failed to save chat history');
        } else {
          console.log('Successfully saved chat');
          // Update the current chat ID with the newly created chat
          const { chat } = await chatResponse.json();
          setCurrentChatId(chat.id);
        }
      } else {
        console.error('No userId available to save chat');
        router.push('/login');
      }
    } catch (err) {
      console.error('Error in handleChatbot:', err);
      setError("Failed to fetch chatbot data.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Web Scraper & Data Visualizer
          </h1>

          {/* URL Input Section */}
          <div className="bg-gray-900 rounded-lg p-6 shadow-xl mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input
                type="text"
                placeholder="Enter URL to scrape"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              />
              <button 
                onClick={handleScrape}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Scraping..." : "Scrape Website"}
              </button>
            </div>
            {error && (
              <p className="mt-4 text-red-400 text-sm">{error}</p>
            )}
          </div>

          {/* Scraped Content Section */}
          <div className="bg-gray-900 rounded-lg p-6 shadow-xl mb-8">
            <button 
              className="w-full bg-gray-800 hover:bg-gray-700 text-white text-lg font-medium py-3 rounded-lg transition-colors mb-4"
              onClick={() => setDropdown(!dropdown)}
            >
              {dropdown ? "Hide Scraped Content" : "Show Scraped Content"}
            </button>
            {dropdown && (
              <textarea 
                value={data} 
                onChange={(e) => setData(e.target.value)} 
                className="w-full h-64 p-4 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none"
              />
            )}
          </div>

          {/* Chart Configuration Section */}
          <div className="bg-gray-900 rounded-lg p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-semibold mb-6">Configure Visualization</h2>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <label className="text-sm font-medium text-gray-300">Chart Type:</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                >
                  <option value="bar">Bar Chart</option>
                  <option value="table">Table</option>
                  <option value="pie">Pie Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="scatter">Scatter Plot</option>
                </select>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center">
                <label className="text-sm font-medium text-gray-300">Chart Specifications:</label>
                <input 
                  value={chatbotWindow}
                  onChange={(e) => setChatbotWindow(e.target.value)}
                  placeholder="Ex: Create a chart showing discount percentages"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
                <button 
                  onClick={handleChatbot}
                  disabled={isLoading}
                  className=" bg-purple-600 py-2 px-4 hover:bg-purple-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Generating..." : "Generate Chart"}
                </button>
              </div>
            </div>
          </div>

          {/* Chart Display Section */}
          {chatbotData && (
            <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
              <Chart chatResponse={chatbotData} inputChartType={type}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
