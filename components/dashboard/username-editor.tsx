'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { Copy, Check, ExternalLink } from 'lucide-react'

interface UsernameEditorProps {
  currentUsername: string
}

export function UsernameEditor({ currentUsername }: UsernameEditorProps) {
  const [username, setUsername] = useState(currentUsername)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://linkhub-ecru.vercel.app'
  const profileUrl = `${appUrl}/${username}`

  const validateUsername = (value: string) => {
    // Only allow letters, numbers, underscores, and hyphens
    const regex = /^[a-zA-Z0-9_-]+$/
    return regex.test(value) && value.length >= 3 && value.length <= 30
  }

  const handleUsernameChange = async (value: string) => {
    const lowercaseValue = value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
    setUsername(lowercaseValue)
    setIsAvailable(null)

    if (lowercaseValue === currentUsername) {
      setIsAvailable(true)
      return
    }

    if (!validateUsername(lowercaseValue)) {
      return
    }

    // Debounce check
    setIsChecking(true)
    try {
      const response = await fetch(`/api/username/check?username=${lowercaseValue}`)
      const data = await response.json()
      setIsAvailable(data.available)
    } catch (error) {
      console.error('Error checking username:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleSave = async () => {
    if (!validateUsername(username)) {
      toast.error('Username must be 3-30 characters, only letters, numbers, underscores, and hyphens')
      return
    }

    if (username === currentUsername) {
      toast.success('No changes to save')
      return
    }

    if (!isAvailable) {
      toast.error('Username is not available')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/username', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update username')
      }

      toast.success('Username updated! Your new link is ready.')
      // Refresh the page to update the displayed username
      window.location.reload()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update username')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const hasChanges = username !== currentUsername
  const isValid = validateUsername(username)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your LinkHub URL</CardTitle>
        <CardDescription>Customize your unique profile link</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* URL Preview */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-500 text-sm shrink-0">{appUrl.replace('https://', '')}/</span>
          <Input
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            className="flex-1 border-0 bg-transparent p-0 font-medium focus-visible:ring-0"
            placeholder="yourname"
          />
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Copy link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500" />
            )}
          </button>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Open profile"
          >
            <ExternalLink className="w-4 h-4 text-gray-500" />
          </a>
        </div>

        {/* Validation feedback */}
        {username && (
          <div className="text-sm">
            {!isValid && (
              <p className="text-red-500">
                Username must be 3-30 characters, only letters, numbers, underscores, and hyphens
              </p>
            )}
            {isValid && isChecking && (
              <p className="text-gray-500">Checking availability...</p>
            )}
            {isValid && !isChecking && isAvailable === true && username !== currentUsername && (
              <p className="text-green-500">Username is available!</p>
            )}
            {isValid && !isChecking && isAvailable === false && (
              <p className="text-red-500">Username is already taken</p>
            )}
          </div>
        )}

        {/* Save button */}
        {hasChanges && (
          <Button
            onClick={handleSave}
            disabled={!isValid || !isAvailable || isLoading}
            isLoading={isLoading}
            className="w-full"
          >
            Save New Username
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
