"use client"

import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from 'lucide-react'

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
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/chat/messages')
      setMessages(response.data.messages)
    } catch (error: any) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    
    setLoading(true)
    try {
      const response = await axios.post('/api/chat/messages', { 
        content: newMessage 
      })
      
      if (response.data.data) {
        setMessages(prev => [...prev, response.data.data])
        setNewMessage('')
        scrollToBottom()
      }
    } catch (error: any) {
        console.error('Error sending message:', error);
        console.error('Full error:', error.response?.data || error.message);
        toast.error(error.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          {messages.map((message) => (
            <Card key={message._id} className="bg-white dark:bg-indigo-800">
              <CardContent className="p-3">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={`/placeholder.svg?height=32&width=32&text=${message.senderId.username.charAt(0)}`} 
                      alt={message.senderId.username} 
                    />
                    <AvatarFallback>{message.senderId.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-300">
                        {message.senderId.username}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                      {!message.isRead && (
                        <span className="text-xs text-green-500">•</span>
                      )}
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 mt-1">{message.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="p-4 bg-white dark:bg-indigo-950 border-t border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-indigo-50 dark:bg-indigo-900 border-indigo-200 dark:border-indigo-700"
            placeholder="Type your message..."
            disabled={loading}
          />
          <Button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
            disabled={loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

