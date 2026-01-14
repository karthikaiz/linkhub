'use client'

import { useState } from 'react'
import { Mail, Send, Check } from 'lucide-react'

interface EmailCaptureProps {
  userId: string
  title?: string
  description?: string
  buttonColor: string
  textColor: string
  profileTextColor: string
  isGlass?: boolean
}

export function EmailCapture({
  userId,
  title = 'Stay Updated',
  description = 'Subscribe to get the latest updates',
  buttonColor,
  textColor,
  profileTextColor,
  isGlass = false,
}: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setIsSuccess(true)
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          backgroundColor: isGlass ? 'rgba(255,255,255,0.1)' : `${buttonColor}15`,
          backdropFilter: isGlass ? 'blur(10px)' : 'none',
          border: isGlass ? '1px solid rgba(255,255,255,0.2)' : 'none',
        }}
      >
        <div
          className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
          style={{ backgroundColor: buttonColor }}
        >
          <Check className="w-6 h-6" style={{ color: textColor }} />
        </div>
        <p className="font-semibold" style={{ color: profileTextColor }}>
          You&apos;re subscribed!
        </p>
        <p className="text-sm opacity-70 mt-1" style={{ color: profileTextColor }}>
          Thanks for joining the list
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: isGlass ? 'rgba(255,255,255,0.1)' : `${buttonColor}10`,
        backdropFilter: isGlass ? 'blur(10px)' : 'none',
        border: isGlass ? '1px solid rgba(255,255,255,0.2)' : 'none',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${buttonColor}20` }}
        >
          <Mail className="w-5 h-5" style={{ color: buttonColor }} />
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: profileTextColor }}>
            {title}
          </h3>
          <p className="text-sm opacity-70" style={{ color: profileTextColor }}>
            {description}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: isGlass ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)',
            color: isGlass ? profileTextColor : '#000',
            border: isGlass ? '1px solid rgba(255,255,255,0.2)' : 'none',
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
          style={{
            backgroundColor: buttonColor,
            color: textColor,
          }}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}
