import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'react-hot-toast';

interface ChatMessage {
  role: string;
  content: string;
  timestamp: string;
}

const ConnectAIPage = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = () => {
    if (autoScroll && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const initialMessage = { role: 'assistant', content: 'Hello, My name is Connecitfy-AI. Tell me how can I help you today.', timestamp: new Date().toISOString() };
    setChatHistory([initialMessage]); 
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message, timestamp: new Date().toISOString() };
    setChatHistory((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const response = await fetch('/api/chat/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = { role: 'assistant', content: data.reply, timestamp: new Date().toISOString() };
        setChatHistory((prev) => [...prev, aiMessage]);
      } else {
        toast.error('Error: Could not get a response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error: Network issue or server error.');
    } finally {
      setLoading(false);
    }

    setMessage('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto ">
      <ScrollArea
        className="flex-1 p-4 space-y-4"
        ref={scrollAreaRef}
      >
        {chatHistory.map((chat, index) => (
          <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] gap-2 ${chat.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`/placeholder.svg?height=32&width=32&text=${chat.role === 'user' ? 'U' : 'AI'}`}
                  alt={chat.role === 'user' ? 'User' : 'AI'}
                />
                <AvatarFallback>{chat.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
              </Avatar>
              <div
                className={`rounded-2xl px-4 py-2 text-sm ${chat.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                <p>{chat.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {formatTimestamp(chat.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>

      <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 ">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 dark:bg-[#3a2955] bg-gray-100 border-transparent text-gray-800 placeholder-gray-400 dark:text-white"
            placeholder="Type a message..."
            disabled={loading}
          />
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-blue-700 text-white w-[35px]"
            disabled={loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConnectAIPage;
