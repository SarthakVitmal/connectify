import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Image, Trash2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import ErrorPage from '@/components/ui/error'
import { MdDelete } from "react-icons/md";

interface Message {
  _id: string
  content: string
  senderId: {
    _id: string
    username: string
  }
  timestamp: string
  isRead: boolean
}

export default function GlobalChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const [error, setError] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ username: string; _id: string } | null>(null);

  useEffect(() => {
    // Fetch the current user
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/api/auth/user"); // Replace with your actual API endpoint
        console.log(response.data)
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const isCurrentUser = (senderId: { _id: string }) => senderId._id === currentUser?._id;

  const scrollToBottom = () => {
    if (autoScroll && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async (retryCount = 0) => {
    try {
      const response = await axios.get('/api/chat/messages')
      setMessages(response.data.messages)
    } catch (error: any) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')

      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => fetchMessages(retryCount + 1), delay);
      } else {
        setError(true);
      }
    }
  }

  const handleDelete = async (messageId: string) => {
    try {
      const response = await axios.delete(`/api/chat/messages?message_id=${messageId}`)
      if (response.status === 200) {
        setMessages((prev) => prev.filter((message) => message._id !== messageId));
        return console.log('Message deleted successfully')
      }
    } catch (error) {
      return console.log(error)
    }
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = event.currentTarget
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setAutoScroll(isNearBottom)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setNewMessage('')
    scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' })
    if (!newMessage.trim()) return

    setLoading(true)
    try {
      const response = await axios.post('/api/chat/messages', {
        content: newMessage
      })

      if (response.data.data) {
        setMessages((prev) => [...prev, response.data.data])
        setAutoScroll(true)
        scrollToBottom()
      }
    } catch (error: any) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-IN', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    })
  }

  if (error) {
    return <ErrorPage error={new Error('Failed to load messages')} reset={() => setError(false)} />
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
    <ScrollArea
      className="flex-1"
      onScroll={handleScroll}
      ref={scrollAreaRef}
    >
      <div className="flex flex-col gap-4 p-4">
        {messages.map((message, index) => (
          <div
            key={`${message._id}-${index}`}
            className={cn(
              "flex group relative",
              isCurrentUser(message.senderId) ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "flex max-w-[80%] gap-2 relative",
              isCurrentUser(message.senderId) ? "flex-row-reverse" : "flex-row"
            )}>
              {!isCurrentUser(message.senderId) && (
                <Avatar className="h-8 w-8 self-end" title={message.senderId?.username}>
                  <AvatarImage
                    src={`/placeholder.svg?height=32&width=32&text=${message.senderId?.username?.charAt(0)}`}
                    alt={message.senderId?.username || 'User'}
                  />
                  <AvatarFallback>{message.senderId?.username?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                "rounded-2xl px-4 py-2 text-sm relative",
                isCurrentUser(message.senderId)
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 dark:bg-[#3A2955] text-gray-800 dark:text-white"
              )}>
                <p>{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>

              {isCurrentUser(message.senderId) && (
                <>
                  <button
                    onClick={() => handleDelete(message._id)}
                    className={cn(
                      "absolute -left-8 top-1/2 transform -translate-y-1/2",
                      "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                      "p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white"
                    )}
                    aria-label="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <Avatar className="h-8 w-8 self-end">
                    <AvatarImage
                      src={`/placeholder.svg?height=32&width=32&text=${message.senderId?.username?.charAt(0)}`}
                      alt={message.senderId?.username || 'You'}
                    />
                    <AvatarFallback>{message.senderId?.username?.charAt(0) || 'Y'}</AvatarFallback>
                  </Avatar>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>

      <form onSubmit={sendMessage} className="mt-0 p-4 border-t border-gray-200 dark:border-[#3A2955]">
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="text-gray-400">
            <Image className="h-5 w-5" />
          </Button>
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-gray-100 dark:bg-[#3A2955] border-transparent text-gray-800 dark:text-white placeholder-gray-400"
            placeholder="Type a Message..."
            disabled={loading}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
