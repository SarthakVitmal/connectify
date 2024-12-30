"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, LogOut, Search, Menu, X, Send, Video, Maximize2, MoreVertical, ImageIcon, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import GlobalChat from "@/components/ui/global-chat"
import { MessageCircle } from 'lucide-react'
import AiChatBot from "@/components/ui/ai-chat-bot"

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
  unread?: number
  time?: string
}

export default function ChatApplication() {
  const { username } = useParams()
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "Connectify",
      status: 'online',
      lastMessage: "Welcome to Connectify",
      avatar: "",
      unread: 0,
      time: ""
    },
    {
      id: 2,
      name: "AI Chatbot",
      status: 'online',
      lastMessage: "Your AI Assistant",
      avatar: "/ai-avatar.png", 
      unread: 0,
      time: ""
    },
  ])
  const [filteredContacts, setFilteredContacts] = useState(contacts)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isGlobalChat, setIsGlobalChat] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  const handleSearch = (searchTerm: string) => {
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredContacts(filtered)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })
      toast.success('You have been logged out')
      window.location.href = `${window.location.origin}/login`
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev)
  }

  // Sidebar content component
  const SidebarContent = ({ collapsed = false }) => (
    <div className={cn(
      "flex flex-col h-full bg-white dark:bg-[#1F1533] text-gray-800 dark:text-white transition-all duration-300",
      collapsed ? "w-20" : "w-[300px]"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-[#2A1C45]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-indigo-500" />

            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Connectify
            </span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-800 dark:text-white">
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {!collapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-[#2A1C45]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search chats..."
              className="pl-9 bg-gray-100 dark:bg-[#2A1C45] border-transparent text-gray-800 dark:text-white placeholder-gray-400"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 px-2">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
              selectedContact?.id === contact.id
                ? "bg-purple-100 dark:bg-[#E91E63]"
                : "hover:bg-gray-100 dark:hover:bg-[#2A1C45]"
            )}
            onClick={() => {
              setSelectedContact(contact)
              setIsGlobalChat(false)
              setIsMobileMenuOpen(false)
            }}
          >
            <div className="relative group">
              <Avatar className="h-10 w-10">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#1F1533]",
                  contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                )}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded shadow-md">
                {contact.name}
              </div>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="font-medium truncate">{contact.name}</span>
                  <span className="text-xs text-gray-400">{contact.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{contact.lastMessage}</p>
                  {contact.unread && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 dark:border-[#2A1C45]">
        {!collapsed && (
          <Button
            onClick={toggleTheme}
            variant="outline"
            className="w-full justify-start mb-2 text-gray-800 dark:text-white"
          >
            {theme === 'light' ? <Moon className="mr-2 h-5 w-5" /> : <Sun className="mr-2 h-5 w-5" />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Button>
        )}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className={cn(
            "w-full justify-start text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2A1C45]",
            collapsed && "px-0 justify-center"
          )}
        >
          <LogOut className={cn("h-5 w-5", !collapsed && "mr-2")} />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  )

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 md:hidden z-50 text-gray-800 dark:text-white"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="p-0 bg-white dark:bg-[#1F1533] border-r border-gray-200 dark:border-[#2A1C45]"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:block border-r border-gray-200 dark:border-[#2A1C45] transition-all duration-300",
        isSidebarCollapsed ? "w-20" : "w-[300px]"
      )}>
        <SidebarContent collapsed={isSidebarCollapsed} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#2A1C45] overflow-hidden">
        {selectedContact ? (
          <>
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-[#3A2955]">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-white">{selectedContact.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedContact.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-600 dark:text-white">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-600 dark:text-white">
                  <Maximize2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-600 dark:text-white">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
            {selectedContact.name === "AI Chatbot" ? (
              <AiChatBot />
            ) : (
              <GlobalChat />
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-800 dark:text-white">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Welcome to Connectify</h3>
              <p className="text-gray-600 dark:text-gray-400">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

