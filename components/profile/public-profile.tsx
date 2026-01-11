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
    backgroundStyle?: string
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
        return 'rounded-xl'
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

  const isLightBg = isLightBackground(profile.backgroundColor)
  const profileTextColor = isLightBg ? '#000000' : '#ffffff'

  // Generate gradient background based on main color
  const getBackgroundStyle = () => {
    const baseColor = profile.backgroundColor
    const style = profile.backgroundStyle || 'gradient'

    if (style === 'solid') {
      return { backgroundColor: baseColor }
    }

    // Create gradient variations
    const hex = baseColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)

    // Lighter version
    const lighterR = Math.min(255, r + 30)
    const lighterG = Math.min(255, g + 30)
    const lighterB = Math.min(255, b + 30)

    // Darker version
    const darkerR = Math.max(0, r - 20)
    const darkerG = Math.max(0, g - 20)
    const darkerB = Math.max(0, b - 20)

    const lighter = `rgb(${lighterR}, ${lighterG}, ${lighterB})`
    const darker = `rgb(${darkerR}, ${darkerG}, ${darkerB})`

    return {
      background: `linear-gradient(135deg, ${lighter} 0%, ${baseColor} 50%, ${darker} 100%)`,
      backgroundSize: '200% 200%',
      animation: 'gradientShift 8s ease infinite',
    }
  }

  const handleLinkClick = async (linkId: string, url: string) => {
    if (!clickedLinks.has(linkId)) {
      setClickedLinks(new Set(Array.from(clickedLinks).concat(linkId)))

      fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId, userId: user.id }),
      }).catch(() => {})
    }

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

  // Branded social colors
  const socialColors: Record<string, string> = {
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    youtube: '#FF0000',
    tiktok: '#000000',
    linkedin: '#0A66C2',
    github: '#333333',
    website: '#6366F1',
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
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
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
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
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
      // TikTok doesn't have a simple iframe embed, so we show a styled link card
      return null // Will be rendered as a regular button with TikTok styling
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
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={getBackgroundStyle()}
    >
      {/* Subtle pattern overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${isLightBg ? '000000' : 'ffffff'}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Animated Avatar Container */}
        <div
          className="relative mx-auto mb-6 w-32 h-32"
          style={{
            animation: 'profilePop 0.6s ease-out forwards, float 4s ease-in-out 0.6s infinite',
          }}
        >
          {/* Animated gradient border */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(45deg, ${profile.buttonColor}, ${profileTextColor}40, ${profile.buttonColor})`,
              animation: 'borderRotate 4s linear infinite',
              padding: '3px',
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor: profile.backgroundColor }}
            />
          </div>

          {/* Avatar */}
          <div
            className="absolute inset-1 rounded-full shadow-2xl flex items-center justify-center text-3xl font-bold overflow-hidden"
            style={{
              backgroundColor: profile.buttonColor,
              color: profile.textColor,
              boxShadow: `0 8px 32px ${profile.buttonColor}40`,
            }}
          >
            {user.image ? (
              <img src={user.image} alt={user.name || user.username} className="w-full h-full object-cover" />
            ) : (
              getInitials(user.name, user.username)
            )}
          </div>
        </div>

        {/* Name with animation */}
        <h1
          className="text-3xl sm:text-4xl font-bold text-center mb-3"
          style={{
            color: profileTextColor,
            animation: 'linkSlideUp 0.5s ease-out 0.2s both',
            textShadow: isLightBg ? 'none' : '0 2px 10px rgba(0,0,0,0.2)',
          }}
        >
          {user.name || user.username}
        </h1>

        {/* Bio */}
        {user.bio && (
          <p
            className="text-center mb-6 opacity-80 max-w-sm mx-auto text-base sm:text-lg leading-relaxed"
            style={{
              color: profileTextColor,
              animation: 'linkSlideUp 0.5s ease-out 0.3s both',
            }}
          >
            {user.bio}
          </p>
        )}

        {/* Enhanced Social Icons */}
        {hasSocialLinks && (
          <div
            className="flex justify-center gap-2 sm:gap-3 mb-8 flex-wrap"
            style={{ animation: 'linkSlideUp 0.5s ease-out 0.4s both' }}
          >
            {profile.socialInstagram && (
              <a
                href={getSocialUrl('instagram', profile.socialInstagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-full transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: `${profileTextColor}15`,
                }}
              >
                <Instagram
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 group-hover:text-[#E4405F]"
                  style={{ color: profileTextColor }}
                />
              </a>
            )}
            {profile.socialTwitter && (
              <a
                href={getSocialUrl('twitter', profile.socialTwitter)}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15` }}
              >
                <Twitter
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 group-hover:text-[#1DA1F2]"
                  style={{ color: profileTextColor }}
                />
              </a>
            )}
            {profile.socialYoutube && (
              <a
                href={getSocialUrl('youtube', profile.socialYoutube)}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15` }}
              >
                <Youtube
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 group-hover:text-[#FF0000]"
                  style={{ color: profileTextColor }}
                />
              </a>
            )}
            {profile.socialTiktok && (
              <a
                href={getSocialUrl('tiktok', profile.socialTiktok)}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15` }}
              >
                <span style={{ color: profileTextColor }} className="transition-colors duration-300 group-hover:text-black">
                  <TikTokIcon />
                </span>
              </a>
            )}
            {profile.socialLinkedin && (
              <a
                href={getSocialUrl('linkedin', profile.socialLinkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15` }}
              >
                <Linkedin
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 group-hover:text-[#0A66C2]"
                  style={{ color: profileTextColor }}
                />
              </a>
            )}
            {profile.socialGithub && (
              <a
                href={getSocialUrl('github', profile.socialGithub)}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15` }}
              >
                <Github
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 group-hover:text-[#333333]"
                  style={{ color: profileTextColor }}
                />
              </a>
            )}
            {profile.socialWebsite && (
              <a
                href={getSocialUrl('website', profile.socialWebsite)}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15` }}
              >
                <Globe
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 group-hover:text-[#6366F1]"
                  style={{ color: profileTextColor }}
                />
              </a>
            )}
          </div>
        )}

        {/* Links with staggered animation */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <p
              className="text-center py-8 opacity-50"
              style={{ color: profileTextColor }}
            >
              No links yet
            </p>
          ) : (
            links.map((link, index) => {
              const embedComponent = getEmbedComponent(link)
              const animationDelay = 0.5 + (index * 0.1)

              if (embedComponent) {
                return (
                  <div
                    key={link.id}
                    className="space-y-3"
                    style={{ animation: `linkSlideUp 0.5s ease-out ${animationDelay}s both` }}
                  >
                    <p
                      className="text-sm font-semibold text-center uppercase tracking-wider opacity-70"
                      style={{ color: profileTextColor }}
                    >
                      {link.title}
                    </p>
                    {embedComponent}
                  </div>
                )
              }
              // For TikTok, use embedUrl as the link destination
              const linkUrl = link.type === 'tiktok' && link.embedUrl ? link.embedUrl : link.url

              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, linkUrl)}
                  className={`group w-full py-4 px-6 text-center font-semibold transition-all duration-300 ${getButtonClass()}`}
                  style={{
                    backgroundColor: profile.buttonColor,
                    color: profile.textColor,
                    boxShadow: `0 4px 15px ${profile.buttonColor}30`,
                    animation: `linkSlideUp 0.5s ease-out ${animationDelay}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                    e.currentTarget.style.boxShadow = `0 8px 25px ${profile.buttonColor}50`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = `0 4px 15px ${profile.buttonColor}30`
                  }}
                >
                  <span className="relative">
                    {link.title}
                    <span
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"
                      style={{ opacity: 0.5 }}
                    />
                  </span>
                </button>
              )
            })
          )}
        </div>

        {/* Branding */}
        <div
          className="mt-12 text-center"
          style={{ animation: 'linkSlideUp 0.5s ease-out 1s both' }}
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm opacity-40 hover:opacity-70 transition-all duration-300 hover:scale-105"
            style={{ color: profileTextColor }}
          >
            <span className="w-4 h-4 rounded-full bg-current opacity-60" />
            Powered by LinkHub
          </a>
        </div>
      </div>
    </div>
  )
}
