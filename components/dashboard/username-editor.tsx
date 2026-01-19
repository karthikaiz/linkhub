'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { Copy, Check, ExternalLink, Pencil, X } from 'lucide-react'

interface UsernameEditorProps {
  currentUsername: string
}

export function UsernameEditor({ currentUsername }: UsernameEditorProps) {
  const [username, setUsername] = useState(currentUsername)
  const [isEditing, setIsEditing] = useState(false)
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

  const handleCancel = () => {
    setUsername(currentUsername)
    setIsEditing(false)
    setIsAvailable(null)
  }

  return (
    <Card className="border-[#e8e4de] bg-white">
      <CardHeader>
        <CardTitle className="text-[#2d3029]">Your LinkHub URL</CardTitle>
        <CardDescription className="text-[#6b6b66]">Customize your unique profile link</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* URL Display (non-editing mode) */}
        {!isEditing && (
          <>
            <div className="flex items-center gap-2 p-3 bg-[#f9f9f7] rounded-xl border border-[#e8e4de]">
              <span className="text-[#6b6b66] text-sm shrink-0">{appUrl.replace('https://', '')}/</span>
              <span className="flex-1 font-medium text-[#2d3029] truncate">{currentUsername}</span>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-[#f5f2ed] rounded-lg transition-colors"
                title="Copy link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#7c9885]" />
                ) : (
                  <Copy className="w-4 h-4 text-[#6b6b66]" />
                )}
              </button>
              <a
                href={`${appUrl}/${currentUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-[#f5f2ed] rounded-lg transition-colors"
                title="Open profile"
              >
                <ExternalLink className="w-4 h-4 text-[#6b6b66]" />
              </a>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full rounded-xl border-[#e8e4de] text-[#2d3029] hover:bg-[#f5f2ed] hover:border-[#7c9885]"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit URL
            </Button>
          </>
        )}

        {/* URL Editor (editing mode) */}
        {isEditing && (
          <>
            <div className="flex items-center gap-2 p-3 bg-[#f9f9f7] rounded-xl border border-[#7c9885]">
              <span className="text-[#6b6b66] text-sm shrink-0">{appUrl.replace('https://', '')}/</span>
              <Input
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                className="flex-1 border-0 bg-transparent p-0 font-medium text-[#2d3029] focus-visible:ring-0"
                placeholder="yourname"
                autoFocus
              />
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
                  <p className="text-[#6b6b66]">Checking availability...</p>
                )}
                {isValid && !isChecking && isAvailable === true && username !== currentUsername && (
                  <p className="text-[#7c9885]">Username is available!</p>
                )}
                {isValid && !isChecking && isAvailable === false && (
                  <p className="text-red-500">Username is already taken</p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={!isValid || !isAvailable || isLoading || !hasChanges}
                isLoading={isLoading}
                className="flex-1 bg-[#7c9885] hover:bg-[#6b8872] text-white rounded-xl"
              >
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="rounded-xl border-[#e8e4de] text-[#2d3029] hover:bg-[#f5f2ed]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
