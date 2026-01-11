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

  const profileTextColor = isLightBackground(backgroundColor) ? '#000000' : '#ffffff'

  const hasSocialLinks = socialLinks && Object.values(socialLinks).some(v => v)

  const TikTokIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )

  return (
    <div
      className="w-full max-w-[320px] min-h-[500px] rounded-3xl p-8 shadow-lg"
      style={{ backgroundColor }}
    >
      {/* Avatar */}
      <div
        className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold overflow-hidden"
        style={{ backgroundColor: buttonColor, color: textColor }}
      >
        {image ? (
          <img src={image} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          getInitials(title, username)
        )}
      </div>

      {/* Name */}
      <h2
        className="text-xl font-bold text-center mb-2"
        style={{ color: profileTextColor }}
      >
        {title || username}
      </h2>

      {/* Bio */}
      {bio && (
        <p
          className="text-sm text-center mb-4 opacity-75"
          style={{ color: profileTextColor }}
        >
          {bio}
        </p>
      )}

      {/* Social Icons */}
      {hasSocialLinks && (
        <div className="flex justify-center gap-3 mb-6">
          {socialLinks?.instagram && (
            <div className="p-2 rounded-full opacity-75 hover:opacity-100" style={{ color: profileTextColor }}>
              <Instagram className="w-5 h-5" />
            </div>
          )}
          {socialLinks?.twitter && (
            <div className="p-2 rounded-full opacity-75 hover:opacity-100" style={{ color: profileTextColor }}>
              <Twitter className="w-5 h-5" />
            </div>
          )}
          {socialLinks?.youtube && (
            <div className="p-2 rounded-full opacity-75 hover:opacity-100" style={{ color: profileTextColor }}>
              <Youtube className="w-5 h-5" />
            </div>
          )}
          {socialLinks?.tiktok && (
            <div className="p-2 rounded-full opacity-75 hover:opacity-100" style={{ color: profileTextColor }}>
              <TikTokIcon />
            </div>
          )}
          {socialLinks?.linkedin && (
            <div className="p-2 rounded-full opacity-75 hover:opacity-100" style={{ color: profileTextColor }}>
              <Linkedin className="w-5 h-5" />
            </div>
          )}
          {socialLinks?.github && (
            <div className="p-2 rounded-full opacity-75 hover:opacity-100" style={{ color: profileTextColor }}>
              <Github className="w-5 h-5" />
            </div>
          )}
          {socialLinks?.website && (
            <div className="p-2 rounded-full opacity-75 hover:opacity-100" style={{ color: profileTextColor }}>
              <Globe className="w-5 h-5" />
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
                className={`py-3 px-4 text-center font-medium ${getButtonClass()}`}
                style={{ backgroundColor: buttonColor, color: textColor }}
              >
                {item}
              </div>
            ))}
          </>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className={`py-3 px-4 text-center font-medium ${getButtonClass()}`}
              style={{ backgroundColor: buttonColor, color: textColor }}
            >
              {link.title}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
