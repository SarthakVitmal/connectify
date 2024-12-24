'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  const [token, setToken] = useState('')
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const verifyUserEmail = async () => {
    try {
      await axios.post('/api/auth/verifyemail', { token })
      setVerified(true)
    } catch (error: any) {
      setError(true)
      console.log(error.response.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1]
    setToken(urlToken || "")
  }, [])

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail()
    } else {
      setLoading(false)
    }
  }, [token])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Verifying your email...</p>
            </div>
          ) : verified ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <h2 className="mt-4 text-xl font-semibold text-green-700 dark:text-green-400">Email Verified Successfully!</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Thank you for verifying your email address.</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="w-16 h-16 text-red-500" />
              <h2 className="mt-4 text-xl font-semibold text-red-700 dark:text-red-400">Verification Failed</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">There was an error verifying your email. Please try again.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="w-16 h-16 text-yellow-500" />
              <h2 className="mt-4 text-xl font-semibold text-yellow-700 dark:text-yellow-400">No Verification Token</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please use the link sent to your email to verify your account.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/login">Go to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

