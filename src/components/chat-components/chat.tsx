import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Image, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  _id: string;
  content: string;
  senderId: {
    _id: string;
    username: string;
  };
  receiverId?: string;
  timestamp: string;
  isRead: boolean;
}

interface ChatProps {
  contactId: string;
  currentUserId: string;
  fetchMessagesUrl: string;
  sendMessageUrl: string;
  deleteMessageUrl: string;
  socketPath: string;
}

export default function Chat({
  contactId,
  currentUserId,
  fetchMessagesUrl,
  sendMessageUrl,
  deleteMessageUrl,
  socketPath
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [error, setError] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; _id: string } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/api/auth/user");
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        console.log('Fetching messages from:', fetchMessagesUrl);
        const response = await fetch(fetchMessagesUrl);
        const data = await response.json();
        
        console.log('Received message data:', data);
  
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch messages');
        }
  
        if (data.success && Array.isArray(data.messages)) {
          setMessages(data.messages);
          setError(false);
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
          }
        } else {
          console.error('Invalid response format:', data);
          setMessages([]);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
        setError(true);
      }
    };
  
    if (contactId && currentUserId) {
      loadMessages();
      // Set up periodic refresh
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [contactId, currentUserId, fetchMessagesUrl]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
  
    setLoading(true);
    try {
      const payload: { content: string; receiverId: string; chatId?: string } = {
        content: newMessage,
        receiverId: contactId, // Assuming contactId is used for receiverId
      };
  
      // Add chatId only for friend chats
      if (contactId !== "Connectify") {
        payload.chatId = `${currentUserId}-${contactId}`;
      }
  
      const response = await fetch(sendMessageUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
  
      if (data.success && data.data) {
        setMessages((prev) => [...prev, data.data]);
        setNewMessage('');
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
  
    if (isToday) {
      return "Today, " + date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "numeric", hour12: true });
    } else if (isYesterday) {
      return "Yesterday, " + date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "numeric", hour12: true });
    }
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + 
           ", " + date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "numeric", hour12: true });
  };

  const isCurrentUser = (senderId: { _id: string } | null) => {
    return currentUser?._id === senderId?._id;
  };

  if (error) {
    return <p className="text-center text-red-500">Failed to load messages.</p>;
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4 p-4">
          {messages.map((message) => (
            <div key={message._id} className={cn("flex", isCurrentUser(message.senderId) ? "justify-end" : "justify-start")}>
              <div className={cn("flex max-w-[80%] gap-2", isCurrentUser(message.senderId) ? "flex-row" : "flex-row")}>
                <Avatar title={message.senderId?.username}>
                  <AvatarImage src={`/placeholder.svg?text=${message.senderId?.username?.charAt(0)}`} />
                  <AvatarFallback>{message.senderId?.username?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className={cn("rounded-lg p-2", isCurrentUser(message.senderId) ? "bg-purple-600 text-white" : "bg-gray-200")}>
                  <p>{message.content}</p>
                  <span className="text-xs opacity-50">{formatTimestamp(message.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="Type a message..." 
          />
          <Button type="submit" disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}