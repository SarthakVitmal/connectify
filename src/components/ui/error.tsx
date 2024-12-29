'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, RefreshCcw, LogIn } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#1F1533] p-4">
      <Card className="w-full max-w-md bg-white dark:bg-[#2A1C45] text-gray-800 dark:text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-red-600 dark:text-red-400">
            <AlertCircle className="h-6 w-6" />
            Oops! Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We're sorry, but an unexpected error occurred. Our team has been notified and is working on fixing the issue.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Error: {error.message || "Unknown error"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            If the issue persists, please try logging out and logging back in to refresh your session.
          </p>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-between gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={() => reset()}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

