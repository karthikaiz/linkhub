'use client'

import { Instagram, Twitter, Youtube, Linkedin, Github, Globe } from 'lucide-react'

interface SocialLinks {
  instagram?: string
  twitter?: string
  youtube?: string
  tiktok?: string
  linkedin?: string
  github?: string
  website?: string
}

interface ProfilePreviewProps {
  username: string
  title: string
  bio: string
  links: { id: string; title: string; url: string; type?: string; embedUrl?: string }[]
  backgroundColor: string
  buttonColor: string
  textColor: string
  buttonStyle: string
  image?: string
  socialLinks?: SocialLinks
  particleEffect?: string
}

export function ProfilePreview({
  username,
  title,
  bio,
  links,
  backgroundColor,
  buttonColor,
  textColor,
  buttonStyle,
  image,
  socialLinks,
  particleEffect = 'none',
}: ProfilePreviewProps) {
  const getInitials = (name: string, fallback: string) => {
    if (name) {
      const parts = name.trim().split(' ').filter(Boolean)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return name.slice(0, 2).toUpperCase()
    }
    return fallback.slice(0, 2).toUpperCase()
  }

  const getButtonClass = () => {
    switch (buttonStyle) {
      case 'rounded':
        return 'rounded-full'
      case 'square':
        return 'rounded-none'
      case 'soft':
        return 'rounded-xl'
      case 'glass':
        return 'rounded-xl'
      default:
        return 'rounded-full'
    }
  }

  const isGlassStyle = buttonStyle === 'glass'

  const isLightBackground = (color: string) => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128
  }

  const isLightBg = isLightBackground(backgroundColor)
  const profileTextColor = isLightBg ? '#000000' : '#ffffff'

  // Generate gradient background
  const getBackgroundStyle = () => {
    const hex = backgroundColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)

    const lighterR = Math.min(255, r + 30)
    const lighterG = Math.min(255, g + 30)
    const lighterB = Math.min(255, b + 30)

    const darkerR = Math.max(0, r - 20)
    const darkerG = Math.max(0, g - 20)
    const darkerB = Math.max(0, b - 20)

    const lighter = `rgb(${lighterR}, ${lighterG}, ${lighterB})`
    const darker = `rgb(${darkerR}, ${darkerG}, ${darkerB})`

    return {
      background: `linear-gradient(135deg, ${lighter} 0%, ${backgroundColor} 50%, ${darker} 100%)`,
    }
  }

  const hasSocialLinks = socialLinks && Object.values(socialLinks).some(v => v)

  const TikTokIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )

  return (
    <div
      className="w-full max-w-[320px] min-h-[500px] rounded-3xl p-6 shadow-2xl relative overflow-hidden"
      style={getBackgroundStyle()}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${isLightBg ? '000000' : 'ffffff'}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        {/* Avatar with animated border */}
        <div className="relative mx-auto mb-4 w-24 h-24">
          {/* Gradient border */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(45deg, ${buttonColor}, ${profileTextColor}40, ${buttonColor})`,
              padding: '3px',
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor }}
            />
          </div>

          {/* Avatar */}
          <div
            className="absolute inset-1 rounded-full shadow-xl flex items-center justify-center text-xl font-bold overflow-hidden"
            style={{
              backgroundColor: buttonColor,
              color: textColor,
              boxShadow: `0 8px 24px ${buttonColor}40`,
            }}
          >
            {image ? (
              <img src={image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              getInitials(title, username)
            )}
          </div>
        </div>

        {/* Name */}
        <h2
          className="text-2xl font-bold text-center mb-2"
          style={{
            color: profileTextColor,
            textShadow: isLightBg ? 'none' : '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {title || username}
        </h2>

        {/* Bio */}
        {bio && (
          <p
            className="text-sm text-center mb-4 opacity-80 leading-relaxed"
            style={{ color: profileTextColor }}
          >
            {bio}
          </p>
        )}

        {/* Social Icons */}
        {hasSocialLinks && (
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {socialLinks?.instagram && (
              <div
                className="p-2.5 rounded-full transition-transform hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15`, color: profileTextColor }}
              >
                <Instagram className="w-4 h-4" />
              </div>
            )}
            {socialLinks?.twitter && (
              <div
                className="p-2.5 rounded-full transition-transform hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15`, color: profileTextColor }}
              >
                <Twitter className="w-4 h-4" />
              </div>
            )}
            {socialLinks?.youtube && (
              <div
                className="p-2.5 rounded-full transition-transform hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15`, color: profileTextColor }}
              >
                <Youtube className="w-4 h-4" />
              </div>
            )}
            {socialLinks?.tiktok && (
              <div
                className="p-2.5 rounded-full transition-transform hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15`, color: profileTextColor }}
              >
                <TikTokIcon />
              </div>
            )}
            {socialLinks?.linkedin && (
              <div
                className="p-2.5 rounded-full transition-transform hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15`, color: profileTextColor }}
              >
                <Linkedin className="w-4 h-4" />
              </div>
            )}
            {socialLinks?.github && (
              <div
                className="p-2.5 rounded-full transition-transform hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15`, color: profileTextColor }}
              >
                <Github className="w-4 h-4" />
              </div>
            )}
            {socialLinks?.website && (
              <div
                className="p-2.5 rounded-full transition-transform hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15`, color: profileTextColor }}
              >
                <Globe className="w-4 h-4" />
              </div>
            )}
          </div>
        )}

        {/* Links */}
        <div className="space-y-3">
          {links.length === 0 ? (
            <>
              {['Link 1', 'Link 2', 'Link 3'].map((item, i) => (
                <div
                  key={i}
                  className={`py-3 px-4 text-center font-semibold transition-all ${getButtonClass()}`}
                  style={{
                    backgroundColor: isGlassStyle ? 'rgba(255,255,255,0.1)' : buttonColor,
                    color: isGlassStyle ? profileTextColor : textColor,
                    boxShadow: `0 4px 12px ${buttonColor}30`,
                    backdropFilter: isGlassStyle ? 'blur(10px)' : 'none',
                    border: isGlassStyle ? '1px solid rgba(255,255,255,0.2)' : 'none',
                  }}
                >
                  {item}
                </div>
              ))}
            </>
          ) : (
            links.map((link) => (
              <div
                key={link.id}
                className={`py-3 px-4 text-center font-semibold transition-all ${getButtonClass()}`}
                style={{
                  backgroundColor: isGlassStyle ? 'rgba(255,255,255,0.1)' : buttonColor,
                  color: isGlassStyle ? profileTextColor : textColor,
                  boxShadow: `0 4px 12px ${buttonColor}30`,
                  backdropFilter: isGlassStyle ? 'blur(10px)' : 'none',
                  border: isGlassStyle ? '1px solid rgba(255,255,255,0.2)' : 'none',
                }}
              >
                {link.title}
              </div>
            ))
          )}
        </div>

        {/* Branding */}
        <div className="mt-6 text-center">
          <span
            className="inline-flex items-center gap-1.5 text-xs opacity-40"
            style={{ color: profileTextColor }}
          >
            <span className="w-3 h-3 rounded-full bg-current opacity-60" />
            Powered by LinkHub
          </span>
        </div>
      </div>
    </div>
  )
}
