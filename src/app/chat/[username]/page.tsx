"use client";

  import { useState, useEffect, useRef } from "react";
  import { useParams, useRouter } from "next/navigation";
  import { toast } from "react-toastify";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { Settings, LogOut, Search, Menu, X, Send, Video, Maximize2, MoreVertical, ImageIcon, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
  import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
  import { cn } from "@/lib/utils";
  import GlobalChat from "@/components/chat-components/chat";
  import { MessageCircle } from 'lucide-react';
  import AiChatBot from "@/components/ui/ai-chat-bot";
  import { BadgeCheck } from 'lucide-react';
  import Chat from "@/components/chat-components/chat";

  interface Message {
    id: number;
    sender: string;
    content: string;
    timestamp: string;
  }

  interface Contact {
    id: number | string;
    name: string;
    status: 'online' | 'offline';
    lastMessage: string;
    avatar: string;
    unread?: number;
    time?: string;
    verified?: boolean;
  }
  const getTokenFromCookies = () => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    return cookie ? cookie.split('=')[1] : null;
  };

  export default function ChatApplication() {
    const { username } = useParams();
    const router = useRouter();
    const [contacts, setContacts] = useState<Contact[]>([
      {
        id: 1,
        name: "Connectify",
        status: 'online',
        lastMessage: "Welcome to Connectify",
        avatar: "",
        unread: 0,
        time: "",
        verified: true
      },
      {
        id: 2,
        name: "AI Chatbot",
        status: 'online',
        lastMessage: "Your AI Assistant",
        avatar: "",
        unread: 0,
        time: "",
        verified: true
      },
    ]);
    
    const [filteredContacts, setFilteredContacts] = useState(contacts);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isGlobalChat, setIsGlobalChat] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Contact[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string>('');

    useEffect(() => {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
    }, []);

    useEffect(() => {
      const fetchFriendsAndChats = async () => {
        if (!currentUserId) return;
    
        try {
          const response = await fetch(`/api/chat/friends-message?userId=${currentUserId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });
          
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.error || "Failed to fetch friends");
          }
    
          const friendContacts: Contact[] = data.friends?.map((friend: any) => ({
            id: friend._id,
            name: friend.username,
            status: friend.status || 'offline',
            lastMessage: friend.lastMessage || "No messages yet",
            avatar: friend.avatar || "",
            unread: 0,
            time: new Date().toLocaleTimeString(),
            verified: friend.isVerified
          })) || [];
    
          setContacts(prevContacts => [
            ...prevContacts.filter(contact => 
              contact.name === "Connectify" || contact.name === "AI Chatbot"
            ),
            ...friendContacts
          ]);
          
          setFilteredContacts(friendContacts);
        } catch (error) {
          console.error("Error fetching friends:", error);
          toast.error("Failed to fetch friends");
        }
      };
    
      fetchFriendsAndChats();
    }, [currentUserId]);

    useEffect(() => {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
      setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleSearch = async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        try {
          const response = await fetch(`/api/chat/search-users?username=${searchTerm}&currentUser=${username}`);
          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }
          const users = await response.json();
          setSearchResults(users);
        } catch (error) {
          console.error('Error during search:', error);
          toast.error('Failed to search users');
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          const token = getTokenFromCookies();
          console.log('Token:', token);
          if (token) {
            const response = await fetch('/api/auth/user', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
              credentials: 'include',
            });

            if (response.ok) {
              const data = await response.json();
              console.log('Current user:', data);
              setCurrentUserId(data._id);
              console.log('Current user ID:', data._id);
            } else {
              console.error('Failed to fetch current user');
              toast.error('Failed to fetch user');
            }
          }
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      };

      fetchCurrentUser();
    }, []);


    const handleAddFriend = async (friendId: string) => {
      console.log('currentUserId:', currentUserId);  
      console.log('friendId:', friendId);  
      try {
        const response = await fetch('/api/chat/add-friend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUserId,
            friendId: friendId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add friend');
        }

        const newFriend = searchResults.find(user => user.id === friendId);
        if (newFriend) {
          setContacts(prev => [...prev, newFriend]);
          setSearchResults(prev => prev.filter(user => user.id !== friendId));
          setSearchTerm('');
          toast.success('Friend added successfully!');
        }
      } catch (error) {
        console.error('Error adding friend:', error);
        toast.error('Failed to add friend');
      }
    };


    const handleLogout = async () => {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });
        toast.success('You have been logged out');
        window.location.href = `${window.location.origin}/login`;
      } catch (error) {
        toast.error('Failed to logout');
      }
    };

    const toggleSidebar = () => {
      setIsSidebarCollapsed(prev => !prev);
    };

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
              <div className="flex items-center">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search friends..."
                    value={searchTerm}
                    className="pl-9 pr-20 bg-gray-100 dark:bg-[#2A1C45] border-transparent text-gray-800 dark:text-white placeholder-gray-400"
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white"
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-[#2A1C45] border border-gray-200 dark:border-[#3A2955] rounded-md shadow-lg">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#3A2955]"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.status}</p>
                        </div>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddFriend(user.id.toString());
                        }}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white"
                      >
                        Add Friend
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {searchTerm && searchResults.length === 0 && !isSearching && (
                <div className="absolute z-10 w-full mt-2 p-3 bg-white dark:bg-[#2A1C45] border border-gray-200 dark:border-[#3A2955] rounded-md shadow-lg text-center">
                  No users found
                </div>
              )}
            </div>
          </div>
        )}

        <ScrollArea className="flex-1 px-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                selectedContact?.id === contact.id
                  ? "bg-purple-100 dark:bg-[#E91E63]"
                  : "hover:bg-gray-100 dark:hover:bg-[#2A1C45]"
              )}
              onClick={() => {
                setSelectedContact(contact);
                setIsGlobalChat(contact.name === "Connectify");
                setIsMobileMenuOpen(false);
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
                    contact.status === "online" ? "bg-green-500" : "bg-gray-400"
                  )}
                />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="font-medium truncate">{contact.name}</span>
                    {contact.verified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{contact.lastMessage}</p>
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
    );

    return (
      <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 md:hidden z-50 text-gray-800 dark:text-white"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>

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
              </div>
              {(() => {
                switch (selectedContact.name) {
                  case "AI Chatbot":
                    return <AiChatBot />;
                  case "Connectify":
                    return <GlobalChat
                      contactId={selectedContact.id.toString()}
                      currentUserId={currentUserId}
                      fetchMessagesUrl={`/api/chat/messages?userId=${currentUserId}`}
                      sendMessageUrl="/api/chat/messages"
                      deleteMessageUrl="/api/chat/messages"
                      socketPath={`/socket.io/?roomId=global_${currentUserId}`}
                    />;
                  default:
                    return <Chat
                      contactId={selectedContact.id.toString()}
                      currentUserId={currentUserId}
                      fetchMessagesUrl={`/api/chat/friends-message?senderId=${currentUserId}&receiverId=${selectedContact.id}`}
                      sendMessageUrl="/api/chat/friends-message"
                      deleteMessageUrl="/api/chat/friends-message"
                      socketPath={`/socket.io/?roomId=${currentUserId}_${selectedContact.id}`}
                    />;
                }
              })()}
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
    );
  }

