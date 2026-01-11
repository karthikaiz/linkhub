'use client'

interface ProfilePreviewProps {
  username: string
  title: string
  bio: string
  links: { id: string; title: string; url: string }[]
  backgroundColor: string
  buttonColor: string
  textColor: string
  buttonStyle: string
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

  return (
    <div
      className="w-full max-w-[320px] min-h-[500px] rounded-3xl p-8 shadow-lg"
      style={{ backgroundColor }}
    >
      {/* Avatar */}
      <div
        className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
        style={{ backgroundColor: buttonColor, color: textColor }}
      >
        {getInitials(title, username)}
      </div>

      {/* Name */}
      <h2
        className="text-xl font-bold text-center mb-1"
        style={{ color: profileTextColor }}
      >
        {title || username}
      </h2>

      {/* Username */}
      <p
        className="text-sm text-center mb-2 opacity-75"
        style={{ color: profileTextColor }}
      >
        @{username}
      </p>

      {/* Bio */}
      {bio && (
        <p
          className="text-sm text-center mb-6 opacity-75"
          style={{ color: profileTextColor }}
        >
          {bio}
        </p>
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
