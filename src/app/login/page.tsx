'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (email === "" || password === "") {
        setError('Please enter both email and password')
      } else {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })
        if (response.ok) {
          const data = await response.json()
          const username = data.username;
          router.push(`/chat/${username}`)
        } else {
          const data = await response.json()
          setError(data.error)
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br  from-indigo-500 to-purple-600">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="font-sans w-full max-w-md bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-indigo-600">Login to Connectify</CardTitle>
            <CardDescription className="text-center text-gray-600">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <Link href="/forgotpassword" className="text-sm text-indigo-600 hover:underline">Forgot password?</Link>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md"
                >
                  <AlertCircle size={20} />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button 
                  type="submit" 
                  className="w-full hover:bg-purple-500 text-white bg-indigo-600 transition-colors duration-200"
                >
                  Login
                </Button>
              </motion.div>
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="text-indigo-600 hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

