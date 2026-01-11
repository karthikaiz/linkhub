'use client'

import { useState } from 'react'
import { Instagram, Twitter, Youtube, Linkedin, Github, Globe } from 'lucide-react'

interface PublicProfileProps {
  user: {
    id: string
    name: string | null
    username: string
    bio: string | null
    image?: string | null
  }
  profile: {
    backgroundColor: string
    buttonStyle: string
    buttonColor: string
    textColor: string
    socialInstagram?: string | null
    socialTwitter?: string | null
    socialYoutube?: string | null
    socialTiktok?: string | null
    socialLinkedin?: string | null
    socialGithub?: string | null
    socialWebsite?: string | null
  }
  links: {
    id: string
    title: string
    url: string
    type?: string
    embedUrl?: string | null
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

  const hasSocialLinks = profile.socialInstagram || profile.socialTwitter ||
    profile.socialYoutube || profile.socialTiktok || profile.socialLinkedin ||
    profile.socialGithub || profile.socialWebsite

  const getSocialUrl = (platform: string, value: string) => {
    switch (platform) {
      case 'instagram': return `https://instagram.com/${value}`
      case 'twitter': return `https://twitter.com/${value}`
      case 'youtube': return value.startsWith('http') ? value : `https://youtube.com/${value}`
      case 'tiktok': return `https://tiktok.com/@${value}`
      case 'linkedin': return value.startsWith('http') ? value : `https://linkedin.com/in/${value}`
      case 'github': return `https://github.com/${value}`
      case 'website': return value.startsWith('http') ? value : `https://${value}`
      default: return value
    }
  }

  const TikTokIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )

  const getEmbedComponent = (link: typeof links[0]) => {
    if (link.type === 'youtube' && link.embedUrl) {
      const videoId = extractYoutubeId(link.embedUrl)
      if (videoId) {
        return (
          <div className="w-full aspect-video rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )
      }
    }
    if (link.type === 'spotify' && link.embedUrl) {
      const spotifyUri = extractSpotifyUri(link.embedUrl)
      if (spotifyUri) {
        return (
          <div className="w-full rounded-lg overflow-hidden">
            <iframe
              src={`https://open.spotify.com/embed/${spotifyUri}`}
              className="w-full"
              height="152"
              allow="encrypted-media"
            />
          </div>
        )
      }
    }
    if (link.type === 'tiktok' && link.embedUrl) {
      return (
        <div className="w-full rounded-lg overflow-hidden bg-black">
          <blockquote
            className="tiktok-embed"
            cite={link.embedUrl}
            data-video-id={extractTikTokId(link.embedUrl)}
          >
            <a href={link.embedUrl} target="_blank" rel="noopener noreferrer"
              className="block py-4 px-6 text-center text-white"
            >
              View on TikTok
            </a>
          </blockquote>
        </div>
      )
    }
    return null
  }

  const extractYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return match?.[1]
  }

  const extractSpotifyUri = (url: string) => {
    const match = url.match(/spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/)
    if (match) return `${match[1]}/${match[2]}`
    return null
  }

  const extractTikTokId = (url: string) => {
    const match = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/)
    return match?.[1]
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: profile.backgroundColor }}
    >
      <div className="w-full max-w-md">
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 shadow-lg flex items-center justify-center text-3xl font-bold overflow-hidden"
          style={{
            backgroundColor: profile.buttonColor,
            color: profile.textColor,
          }}
        >
          {user.image ? (
            <img src={user.image} alt={user.name || user.username} className="w-full h-full object-cover" />
          ) : (
            getInitials(user.name, user.username)
          )}
        </div>

        {/* Name */}
        <h1
          className="text-2xl font-bold text-center mb-2"
          style={{ color: profileTextColor }}
        >
          {user.name || user.username}
        </h1>

        {/* Bio */}
        {user.bio && (
          <p
            className="text-center mb-4 opacity-75 max-w-sm mx-auto"
            style={{ color: profileTextColor }}
          >
            {user.bio}
          </p>
        )}

        {/* Social Icons */}
        {hasSocialLinks && (
          <div className="flex justify-center gap-3 mb-8">
            {profile.socialInstagram && (
              <a
                href={getSocialUrl('instagram', profile.socialInstagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity"
                style={{ color: profileTextColor }}
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {profile.socialTwitter && (
              <a
                href={getSocialUrl('twitter', profile.socialTwitter)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity"
                style={{ color: profileTextColor }}
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {profile.socialYoutube && (
              <a
                href={getSocialUrl('youtube', profile.socialYoutube)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity"
                style={{ color: profileTextColor }}
              >
                <Youtube className="w-5 h-5" />
              </a>
            )}
            {profile.socialTiktok && (
              <a
                href={getSocialUrl('tiktok', profile.socialTiktok)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity"
                style={{ color: profileTextColor }}
              >
                <TikTokIcon />
              </a>
            )}
            {profile.socialLinkedin && (
              <a
                href={getSocialUrl('linkedin', profile.socialLinkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity"
                style={{ color: profileTextColor }}
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {profile.socialGithub && (
              <a
                href={getSocialUrl('github', profile.socialGithub)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity"
                style={{ color: profileTextColor }}
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {profile.socialWebsite && (
              <a
                href={getSocialUrl('website', profile.socialWebsite)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity"
                style={{ color: profileTextColor }}
              >
                <Globe className="w-5 h-5" />
              </a>
            )}
          </div>
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
            links.map((link) => {
              const embedComponent = getEmbedComponent(link)
              if (embedComponent) {
                return (
                  <div key={link.id} className="space-y-2">
                    <p
                      className="text-sm font-medium text-center"
                      style={{ color: profileTextColor }}
                    >
                      {link.title}
                    </p>
                    {embedComponent}
                  </div>
                )
              }
              return (
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
              )
            })
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
