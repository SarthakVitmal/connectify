'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutGrid, MessageSquare, Phone, Video, MoreVertical, Search, Send, Smile } from 'lucide-react'

const friends = [
  { id: '1', name: 'Alice Johnson', status: 'online', avatar: '/avatar1.png' },
  { id: '2', name: 'Bob Smith', status: 'offline', avatar: '/avatar2.png' },
  { id: '3', name: 'Charlie Brown', status: 'away', avatar: '/avatar3.png' },
  { id: '4', name: 'Diana Prince', status: 'online', avatar: '/avatar4.png' },
  { id: '5', name: 'Ethan Hunt', status: 'offline', avatar: '/avatar5.png' },
]

export default function ChatPage() {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null)
  const router = useRouter()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/user-avatar.png" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">Your Name</h2>
              <p className="text-sm text-gray-500">your.email@example.com</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search friends" className="pl-8" />
          </div>
        </div>

        {/* Friends List */}
        <ScrollArea className="flex-1">
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-500">Chat List</h3>
          {friends.map((friend) => (
            <Link 
              key={friend.id} 
              href={`/chat/${friend.id}`}
              className={`p-4 flex items-center space-x-4 cursor-pointer transition-colors ${
                selectedFriend === friend.id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedFriend(friend.id)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={friend.avatar} alt={friend.name} />
                <AvatarFallback>{friend.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-sm font-medium">{friend.name}</h3>
                <p className="text-xs text-gray-500">{friend.status}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                friend.status === 'online' ? 'bg-green-500' : 
                friend.status === 'away' ? 'bg-yellow-500' : 'bg-gray-300'
              }`} />
            </Link>
          ))}
        </ScrollArea>

        {/* Navigation */}
        <div className="p-4 border-t border-gray-200 flex justify-around">
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <LayoutGrid className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatar1.png" alt="Alice Johnson" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">Alice Johnson</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          {/* Chat messages will go here */}
        </ScrollArea>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
            <Input placeholder="Type a message..." className="flex-1" />
            <Button>
              <Send className="h-5 w-5 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Unique Design Element: Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <Button className="relative rounded-full px-7 py-4 bg-black leading-none flex items-center divide-x divide-gray-600">
            <span className="pr-6 text-gray-100">New Chat</span>
            <span className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200">+</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

