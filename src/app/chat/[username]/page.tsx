"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, LogOut, Search, Globe } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import GlobalChat from "@/components/ui/GlobalChat"

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
}

interface Contact {
  id: number
  name: string
  status: 'online' | 'offline'
  lastMessage: string
  avatar: string
}

export default function ChatApplication() {
  const { username } = useParams()
  const [darkMode, setDarkMode] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isGlobalChat, setIsGlobalChat] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState("")

  // useEffect(() => {
  //   // Fetch contacts logic here
  //   const dummyContacts = [
  //     { id: 1, name: "Alice", status: 'online', lastMessage: "Hey there!", avatar: "/placeholder.svg?height=40&width=40" },
  //     { id: 2, name: "Bob", status: 'offline', lastMessage: "See you later", avatar: "/placeholder.svg?height=40&width=40" },
  //   ]
  //   setContacts(dummyContacts)
  //   setFilteredContacts(dummyContacts)
  // }, [])

  const handleSearch = (searchTerm: string) => {
    const filtered = contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredContacts(filtered)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
    toast.success('You have been logged out')
    window.location.href = `${window.location.origin}/login`
  }

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: username as string,
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      try {
        const response = await fetch(`/api/chat/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: username,
            recipient: selectedContact?.name,
            content: message,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send message: ${response.statusText}`);
        }

        setMessages([...messages, newMessage]);
        setMessage('');
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message");
      }
    }
  };

  return (
    <div className={`flex h-screen bg-indigo-50 ${darkMode ? 'dark' : ''}`}>
      <Card className="flex flex-col w-80 bg-white dark:bg-indigo-950 border-r border-indigo-200 dark:border-indigo-800">
        <CardContent className="p-4 border-b border-indigo-200 dark:border-indigo-800">
          <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">Connectify</h1>
        </CardContent>
        
        <CardContent className="p-4">
          <h2 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Chats</h2>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-indigo-400" />
            <Input
              placeholder="Search chats"
              className="pl-8 bg-indigo-50 dark:bg-indigo-900 border-indigo-200 dark:border-indigo-700"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <Button
            variant={isGlobalChat ? "secondary" : "ghost"}
            className="w-full justify-start mb-2"
            onClick={() => setIsGlobalChat(true)}
          >
            <Globe className="mr-2 h-4 w-4" />
            Global Chat - Connectify
          </Button>

          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <Button
                  key={contact.id}
                  variant={!isGlobalChat && selectedContact?.id === contact.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedContact(contact)
                    setIsGlobalChat(false)
                  }}
                >
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {contact.name}
                  <span
                    className={`ml-auto w-2 h-2 rounded-full ${
                      contact.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  />
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>

        <CardContent className="mt-auto p-4 border-t border-indigo-200 dark:border-indigo-800 space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-indigo-700 dark:text-indigo-300">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                  <span>Dark mode</span>
                  <span className="font-normal leading-snug text-indigo-600 dark:text-indigo-300">
                    Toggle dark mode on or off
                  </span>
                </Label>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="w-full justify-start text-indigo-700 dark:text-indigo-300"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </CardContent>
      </Card>

      <Card className="flex-1 flex flex-col bg-white dark:bg-indigo-900">
        <CardContent className="p-4 border-b border-indigo-200 dark:border-indigo-800">
          <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100">
            {isGlobalChat ? "Global Chat" : selectedContact?.name || "Select a chat"}
          </h2>
        </CardContent>

        {isGlobalChat ? (
          <GlobalChat />
        ) : selectedContact ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-indigo-600 dark:text-indigo-300">
              Private chat implementation here
            </p>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-indigo-600 dark:text-indigo-300">
              Select a chat to start messaging
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}

