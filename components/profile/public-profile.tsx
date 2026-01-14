'use client'

import { useState } from 'react'
import { Instagram, Twitter, Youtube, Linkedin, Github, Globe, Music, ShoppingBag, Mail, Phone, MapPin, Coffee, Heart, ExternalLink, Play } from 'lucide-react'
import { Particles } from './particles'
import { EmailCapture } from './email-capture'
import { TipJar } from './tip-jar'

// Platform detection for auto-icons
const PLATFORM_ICONS: Record<string, { icon: string; color: string; name: string }> = {
  'youtube.com': { icon: 'youtube', color: '#FF0000', name: 'YouTube' },
  'youtu.be': { icon: 'youtube', color: '#FF0000', name: 'YouTube' },
  'spotify.com': { icon: 'spotify', color: '#1DB954', name: 'Spotify' },
  'open.spotify.com': { icon: 'spotify', color: '#1DB954', name: 'Spotify' },
  'apple.com/music': { icon: 'apple-music', color: '#FA243C', name: 'Apple Music' },
  'music.apple.com': { icon: 'apple-music', color: '#FA243C', name: 'Apple Music' },
  'instagram.com': { icon: 'instagram', color: '#E4405F', name: 'Instagram' },
  'twitter.com': { icon: 'twitter', color: '#1DA1F2', name: 'Twitter' },
  'x.com': { icon: 'twitter', color: '#000000', name: 'X' },
  'tiktok.com': { icon: 'tiktok', color: '#000000', name: 'TikTok' },
  'linkedin.com': { icon: 'linkedin', color: '#0A66C2', name: 'LinkedIn' },
  'github.com': { icon: 'github', color: '#333333', name: 'GitHub' },
  'discord.gg': { icon: 'discord', color: '#5865F2', name: 'Discord' },
  'discord.com': { icon: 'discord', color: '#5865F2', name: 'Discord' },
  'twitch.tv': { icon: 'twitch', color: '#9146FF', name: 'Twitch' },
  'soundcloud.com': { icon: 'soundcloud', color: '#FF5500', name: 'SoundCloud' },
  'wa.me': { icon: 'whatsapp', color: '#25D366', name: 'WhatsApp' },
  'whatsapp.com': { icon: 'whatsapp', color: '#25D366', name: 'WhatsApp' },
  'api.whatsapp.com': { icon: 'whatsapp', color: '#25D366', name: 'WhatsApp' },
  't.me': { icon: 'telegram', color: '#0088CC', name: 'Telegram' },
  'telegram.me': { icon: 'telegram', color: '#0088CC', name: 'Telegram' },
  'amazon.in': { icon: 'shopping', color: '#FF9900', name: 'Amazon' },
  'amazon.com': { icon: 'shopping', color: '#FF9900', name: 'Amazon' },
  'flipkart.com': { icon: 'shopping', color: '#2874F0', name: 'Flipkart' },
  'patreon.com': { icon: 'heart', color: '#FF424D', name: 'Patreon' },
  'ko-fi.com': { icon: 'coffee', color: '#FF5E5B', name: 'Ko-fi' },
  'buymeacoffee.com': { icon: 'coffee', color: '#FFDD00', name: 'Buy Me a Coffee' },
  'gumroad.com': { icon: 'shopping', color: '#FF90E8', name: 'Gumroad' },
  'notion.so': { icon: 'file', color: '#000000', name: 'Notion' },
  'calendly.com': { icon: 'calendar', color: '#006BFF', name: 'Calendly' },
  'razorpay.me': { icon: 'payment', color: '#0066FF', name: 'Razorpay' },
}

// Pre-built themes for Gen-Z appeal
const THEMES = {
  custom: null, // User's custom colors
  neon: {
    bg: '#0a0a0a',
    button: '#00ff88',
    text: '#000000',
    particles: 'stars' as const,
    buttonStyle: 'glass' as const,
  },
  pastel: {
    bg: '#ffeef8',
    button: '#ffb6c1',
    text: '#4a4a4a',
    particles: 'hearts' as const,
    buttonStyle: 'soft' as const,
  },
  y2k: {
    bg: '#ff00ff',
    button: '#00ffff',
    text: '#000000',
    particles: 'stars' as const,
    buttonStyle: 'glass' as const,
  },
  minimal: {
    bg: '#ffffff',
    button: '#000000',
    text: '#ffffff',
    particles: 'none' as const,
    buttonStyle: 'soft' as const,
  },
  sunset: {
    bg: '#ff6b6b',
    button: '#ffffff',
    text: '#ff6b6b',
    particles: 'confetti' as const,
    buttonStyle: 'rounded' as const,
  },
  ocean: {
    bg: '#0077b6',
    button: '#ffffff',
    text: '#0077b6',
    particles: 'bubbles' as const,
    buttonStyle: 'rounded' as const,
  },
  forest: {
    bg: '#2d6a4f',
    button: '#ffffff',
    text: '#2d6a4f',
    particles: 'none' as const,
    buttonStyle: 'soft' as const,
  },
  snow: {
    bg: '#1a1a2e',
    button: '#ffffff',
    text: '#1a1a2e',
    particles: 'snow' as const,
    buttonStyle: 'glass' as const,
  },
}

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
    theme?: string
    particleEffect?: string
    socialInstagram?: string | null
    socialTwitter?: string | null
    socialYoutube?: string | null
    socialTiktok?: string | null
    socialLinkedin?: string | null
    socialGithub?: string | null
    socialWebsite?: string | null
    socialWhatsapp?: string | null
    socialEmail?: string | null
    // Email capture
    emailCaptureEnabled?: boolean
    emailCaptureTitle?: string | null
    emailCaptureText?: string | null
    // Tip jar
    tipJarEnabled?: boolean
    tipJarUpiId?: string | null
    tipJarText?: string | null
  }
  links: {
    id: string
    title: string
    url: string
    type?: string
    embedUrl?: string | null
  }[]
}

// Custom SVG Icons for platforms
const PlatformIcon = ({ platform, className }: { platform: string; className?: string }) => {
  switch (platform) {
    case 'youtube':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    case 'spotify':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      )
    case 'apple-music':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.99c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.364-1.29.44-2.28 1.223-2.906 2.463-.302.6-.468 1.24-.532 1.91-.06.627-.066 1.26-.066 1.89v10.652c.01.18.017.36.03.54.045.704.117 1.405.354 2.08.475 1.353 1.343 2.3 2.58 2.88.59.28 1.22.448 1.872.514.653.066 1.31.072 1.966.072h10.77c.196-.012.393-.02.59-.035.758-.05 1.508-.138 2.213-.4 1.268-.47 2.18-1.31 2.76-2.534.302-.64.468-1.313.533-2.012.055-.596.06-1.196.06-1.795V6.124zm-6.51 6.78c0 .186-.01.372-.027.556-.04.397-.105.79-.233 1.168-.18.527-.468.98-.888 1.338-.455.387-.996.612-1.588.72-.27.05-.543.065-.817.074-.382.012-.764.006-1.146.006H11.09c-.19 0-.378-.007-.568-.015-.39-.015-.777-.056-1.148-.17-.647-.2-1.142-.583-1.46-1.18-.216-.4-.303-.838-.338-1.29-.025-.318-.02-.638-.02-.957V9.524c0-.185.008-.37.024-.554.037-.38.094-.757.213-1.123.212-.65.59-1.166 1.15-1.543.396-.267.84-.424 1.31-.505.244-.042.492-.06.74-.064.442-.006.884-.003 1.326-.003h3.213c.31.003.618.015.925.057.47.063.917.195 1.324.434.618.363 1.04.878 1.275 1.555.128.37.193.754.228 1.144.018.2.025.402.025.604v3.254z"/>
          <path d="M15.633 9.27c-.004-.194-.044-.382-.128-.56-.113-.236-.29-.416-.514-.547-.198-.116-.418-.173-.646-.19-.186-.014-.374-.01-.56-.01h-3.14c-.19 0-.378.005-.567.022-.328.028-.633.118-.89.335-.285.24-.446.55-.506.912-.03.18-.035.364-.035.547v3.4c0 .186.008.373.035.558.053.345.192.648.45.89.24.225.53.352.854.4.195.03.393.037.59.04.35.007.7.003 1.05.003h2.24c.216 0 .432-.003.647-.023.334-.03.645-.12.913-.32.3-.226.487-.523.57-.882.045-.19.06-.388.062-.584V9.27h-.001z"/>
        </svg>
      )
    case 'tiktok':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      )
    case 'whatsapp':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      )
    case 'telegram':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      )
    case 'discord':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
        </svg>
      )
    case 'twitch':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
        </svg>
      )
    case 'soundcloud':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.05-.1-.1-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c.014.057.045.094.09.094s.089-.037.099-.094l.19-1.308-.19-1.334c-.01-.057-.045-.09-.09-.09m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.104.106.104.061 0 .12-.044.12-.104l.24-2.458-.24-2.563c0-.06-.059-.104-.12-.104m.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.138.149.138.075 0 .135-.061.15-.138l.225-2.544-.225-2.64c-.015-.075-.06-.135-.135-.135m.93-.164c-.09 0-.149.075-.165.164l-.18 2.79.195 2.565c.016.09.075.164.165.164.089 0 .164-.074.179-.164l.21-2.565-.225-2.79c-.016-.089-.075-.164-.165-.164"/>
        </svg>
      )
    default:
      return <ExternalLink className={className} />
  }
}

// Get platform info from URL
const getPlatformFromUrl = (url: string): { icon: string; color: string; name: string } | null => {
  try {
    const hostname = new URL(url).hostname.replace('www.', '')
    for (const [domain, info] of Object.entries(PLATFORM_ICONS)) {
      if (hostname.includes(domain) || domain.includes(hostname)) {
        return info
      }
    }
  } catch {
    // Invalid URL
  }
  return null
}

export function PublicProfile({ user, profile, links }: PublicProfileProps) {
  const [clickedLinks, setClickedLinks] = useState<Set<string>>(new Set())
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  // Get theme settings or use custom colors
  const themeKey = (profile.theme || 'custom') as keyof typeof THEMES
  const theme = THEMES[themeKey]

  const backgroundColor = theme?.bg || profile.backgroundColor
  const buttonColor = theme?.button || profile.buttonColor
  const textColor = theme?.text || profile.textColor
  const particleType = (profile.particleEffect || theme?.particles || 'none') as any
  const buttonStyleOverride = theme?.buttonStyle || profile.buttonStyle

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
    switch (buttonStyleOverride) {
      case 'rounded':
        return 'rounded-full'
      case 'square':
        return 'rounded-none'
      case 'soft':
        return 'rounded-xl'
      case 'glass':
        return 'rounded-xl glass'
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

  const isLightBg = isLightBackground(backgroundColor)
  const profileTextColor = isLightBg ? '#000000' : '#ffffff'

  // Generate gradient background based on main color
  const getBackgroundStyle = () => {
    const baseColor = backgroundColor
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

  const handleLinkClick = async (linkId: string, url: string, event: React.MouseEvent) => {
    // Add ripple effect
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const rippleId = Date.now()
    setRipples(prev => [...prev, { id: rippleId, x, y }])
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId))
    }, 600)

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
    profile.socialGithub || profile.socialWebsite || profile.socialWhatsapp || profile.socialEmail

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
      return null
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

  const isGlassStyle = buttonStyleOverride === 'glass'
  const isNeonTheme = themeKey === 'neon'

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={getBackgroundStyle()}
    >
      {/* Animated Particles */}
      <Particles type={particleType} count={25} />

      {/* Subtle pattern overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-[1]"
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
              background: isNeonTheme
                ? `linear-gradient(45deg, ${buttonColor}, #00ffff, ${buttonColor})`
                : `linear-gradient(45deg, ${buttonColor}, ${profileTextColor}40, ${buttonColor})`,
              animation: isNeonTheme ? 'borderRotate 2s linear infinite, neonPulse 2s ease-in-out infinite' : 'borderRotate 4s linear infinite',
              padding: '3px',
              color: buttonColor,
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor }}
            />
          </div>

          {/* Avatar */}
          <div
            className="absolute inset-1 rounded-full shadow-2xl flex items-center justify-center text-3xl font-bold overflow-hidden"
            style={{
              backgroundColor: buttonColor,
              color: textColor,
              boxShadow: isNeonTheme
                ? `0 0 30px ${buttonColor}80, 0 0 60px ${buttonColor}40`
                : `0 8px 32px ${buttonColor}40`,
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
            textShadow: isNeonTheme
              ? `0 0 10px ${profileTextColor}, 0 0 20px ${profileTextColor}`
              : (isLightBg ? 'none' : '0 2px 10px rgba(0,0,0,0.2)'),
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
            {profile.socialWhatsapp && (
              <a
                href={`https://wa.me/${profile.socialWhatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15` }}
              >
                <span style={{ color: profileTextColor }} className="transition-colors duration-300 group-hover:text-[#25D366]">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </span>
              </a>
            )}
            {profile.socialEmail && (
              <a
                href={`mailto:${profile.socialEmail}`}
                className="group p-3 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: `${profileTextColor}15` }}
              >
                <Mail
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 group-hover:text-[#EA4335]"
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
              const linkUrl = link.type === 'tiktok' && link.embedUrl ? link.embedUrl : link.url

              {
                const platform = getPlatformFromUrl(linkUrl)

                return (
                  <button
                    key={link.id}
                    onClick={(e) => handleLinkClick(link.id, linkUrl, e)}
                    className={`group w-full py-4 px-6 font-semibold transition-all duration-300 relative overflow-hidden ${getButtonClass()} flex items-center justify-center gap-3`}
                    style={{
                      backgroundColor: isGlassStyle ? 'rgba(255,255,255,0.1)' : buttonColor,
                      color: isGlassStyle ? profileTextColor : textColor,
                      boxShadow: isNeonTheme
                        ? `0 0 20px ${buttonColor}60, inset 0 0 20px ${buttonColor}20`
                        : `0 4px 15px ${buttonColor}30`,
                      animation: `linkSlideUp 0.5s ease-out ${animationDelay}s both`,
                      border: isGlassStyle ? `1px solid rgba(255,255,255,0.2)` : 'none',
                      backdropFilter: isGlassStyle ? 'blur(10px)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                      e.currentTarget.style.boxShadow = isNeonTheme
                        ? `0 0 30px ${buttonColor}80, inset 0 0 30px ${buttonColor}30`
                        : `0 8px 25px ${buttonColor}50`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)'
                      e.currentTarget.style.boxShadow = isNeonTheme
                        ? `0 0 20px ${buttonColor}60, inset 0 0 20px ${buttonColor}20`
                        : `0 4px 15px ${buttonColor}30`
                    }}
                  >
                    {/* Ripple effect */}
                    {ripples.map(ripple => (
                      <span
                        key={ripple.id}
                        className="absolute rounded-full bg-white/30 pointer-events-none"
                        style={{
                          left: ripple.x,
                          top: ripple.y,
                          width: 20,
                          height: 20,
                          marginLeft: -10,
                          marginTop: -10,
                          animation: 'ripple 0.6s ease-out forwards',
                        }}
                      />
                    ))}

                    {/* Platform Icon */}
                    {platform && (
                      <span
                        className="w-6 h-6 flex items-center justify-center rounded-md transition-transform duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: `${platform.color}20`,
                          color: isGlassStyle ? profileTextColor : textColor
                        }}
                      >
                        <PlatformIcon platform={platform.icon} className="w-4 h-4" />
                      </span>
                    )}

                    <span className="relative z-10 flex-1 text-center">
                      {link.title}
                      <span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"
                        style={{ opacity: 0.5 }}
                      />
                    </span>

                    {/* External link indicator */}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                  </button>
                )
              }
            })
          )}
        </div>

        {/* Email Capture */}
        {profile.emailCaptureEnabled && (
          <div
            className="mt-6"
            style={{ animation: 'linkSlideUp 0.5s ease-out 0.9s both' }}
          >
            <EmailCapture
              userId={user.id}
              title={profile.emailCaptureTitle || 'Stay Updated'}
              description={profile.emailCaptureText || 'Subscribe to get the latest updates'}
              buttonColor={buttonColor}
              textColor={textColor}
              profileTextColor={profileTextColor}
              isGlass={isGlassStyle}
            />
          </div>
        )}

        {/* Tip Jar */}
        {profile.tipJarEnabled && profile.tipJarUpiId && (
          <div
            className="mt-6"
            style={{ animation: 'linkSlideUp 0.5s ease-out 0.95s both' }}
          >
            <TipJar
              upiId={profile.tipJarUpiId}
              userName={user.name || user.username}
              title="Support My Work"
              description={profile.tipJarText || 'Buy me a coffee!'}
              buttonColor={buttonColor}
              textColor={textColor}
              profileTextColor={profileTextColor}
              isGlass={isGlassStyle}
            />
          </div>
        )}

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
