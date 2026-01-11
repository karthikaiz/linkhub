'use client'

import { useState } from 'react'

interface PublicProfileProps {
  user: {
    id: string
    name: string | null
    username: string
    bio: string | null
  }
  profile: {
    backgroundColor: string
    buttonStyle: string
    buttonColor: string
    textColor: string
  }
  links: {
    id: string
    title: string
    url: string
  }[]
}

export function PublicProfile({ user, profile, links }: PublicProfileProps) {
  const [clickedLinks, setClickedLinks] = useState<Set<string>>(new Set())

  const getInitials = (name: string | null, username: string) => {
    if (name) {
      const parts = name.trim().split(' ').filter(Boolean)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return name.slice(0, 2).toUpperCase()
    }
    return username.slice(0, 2).toUpperCase()
  }

  const getButtonClass = () => {
    switch (profile.buttonStyle) {
      case 'rounded':
        return 'rounded-full'
      case 'square':
        return 'rounded-none'
      case 'soft':
        return 'rounded-lg'
      default:
        return 'rounded-full'
    }
  }

  const isLightBackground = (color: string) => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128
  }

  const profileTextColor = isLightBackground(profile.backgroundColor)
    ? '#000000'
    : '#ffffff'

  const handleLinkClick = async (linkId: string, url: string) => {
    // Optimistically track click
    if (!clickedLinks.has(linkId)) {
      setClickedLinks(new Set(Array.from(clickedLinks).concat(linkId)))

      // Track click in background
      fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId, userId: user.id }),
      }).catch(() => {})
    }

    // Open link
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: profile.backgroundColor }}
    >
      <div className="w-full max-w-md">
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 shadow-lg flex items-center justify-center text-3xl font-bold"
          style={{
            backgroundColor: profile.buttonColor,
            color: profile.textColor,
          }}
        >
          {getInitials(user.name, user.username)}
        </div>

        {/* Name */}
        <h1
          className="text-2xl font-bold text-center mb-1"
          style={{ color: profileTextColor }}
        >
          {user.name || user.username}
        </h1>

        {/* Username */}
        <p
          className="text-sm text-center mb-2 opacity-75"
          style={{ color: profileTextColor }}
        >
          @{user.username}
        </p>

        {/* Bio */}
        {user.bio && (
          <p
            className="text-center mb-8 opacity-75 max-w-sm mx-auto"
            style={{ color: profileTextColor }}
          >
            {user.bio}
          </p>
        )}

        {/* Links */}
        <div className="space-y-3">
          {links.length === 0 ? (
            <p
              className="text-center py-8 opacity-50"
              style={{ color: profileTextColor }}
            >
              No links yet
            </p>
          ) : (
            links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                className={`w-full py-4 px-6 text-center font-medium transition-all hover:scale-105 hover:shadow-lg ${getButtonClass()}`}
                style={{
                  backgroundColor: profile.buttonColor,
                  color: profile.textColor,
                }}
              >
                {link.title}
              </button>
            ))
          )}
        </div>

        {/* Branding */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-sm opacity-50 hover:opacity-75 transition-opacity"
            style={{ color: profileTextColor }}
          >
            Powered by LinkHub
          </a>
        </div>
      </div>
    </div>
  )
}
