'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { ProfilePreview } from './profile-preview'
import { Camera, Instagram, Twitter, Youtube, Linkedin, Github, Globe, Mail, Phone } from 'lucide-react'

interface Profile {
  id: string
  backgroundColor: string
  buttonStyle: string
  buttonColor: string
  textColor: string
  fontFamily: string
  theme: string
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
  emailCaptureEnabled?: boolean
  emailCaptureTitle?: string | null
  emailCaptureText?: string | null
  tipJarEnabled?: boolean
  tipJarUpiId?: string | null
  tipJarText?: string | null
}

interface User {
  username: string | null
  name: string | null
  bio: string | null
  image?: string | null
}

interface Link {
  id: string
  title: string
  url: string
}

interface AppearanceEditorProps {
  profile: Profile
  user: User
  links: Link[]
  isPro: boolean
}

const themes = [
  { id: 'light', name: 'Light', bg: '#ffffff', btn: '#000000', text: '#ffffff', particles: 'none', btnStyle: 'rounded' },
  { id: 'dark', name: 'Dark', bg: '#1a1a2e', btn: '#ffffff', text: '#000000', particles: 'none', btnStyle: 'rounded' },
  { id: 'earthy', name: 'Earthy', bg: '#fdfbf7', btn: '#7c9885', text: '#ffffff', particles: 'none', btnStyle: 'soft' },
  { id: 'neon', name: 'Neon', bg: '#0a0a0a', btn: '#00ff88', text: '#000000', particles: 'stars', btnStyle: 'glass' },
  { id: 'pastel', name: 'Pastel', bg: '#ffeef8', btn: '#ffb6c1', text: '#4a4a4a', particles: 'hearts', btnStyle: 'soft' },
  { id: 'y2k', name: 'Y2K', bg: '#ff00ff', btn: '#00ffff', text: '#000000', particles: 'stars', btnStyle: 'glass' },
  { id: 'minimal', name: 'Minimal', bg: '#ffffff', btn: '#000000', text: '#ffffff', particles: 'none', btnStyle: 'soft' },
  { id: 'sunset', name: 'Sunset', bg: '#ff6b6b', btn: '#ffffff', text: '#ff6b6b', particles: 'confetti', btnStyle: 'rounded' },
  { id: 'ocean', name: 'Ocean', bg: '#0077b6', btn: '#ffffff', text: '#0077b6', particles: 'bubbles', btnStyle: 'rounded' },
  { id: 'forest', name: 'Forest', bg: '#2d6a4f', btn: '#ffffff', text: '#2d6a4f', particles: 'none', btnStyle: 'soft' },
  { id: 'snow', name: 'Snow', bg: '#1a1a2e', btn: '#ffffff', text: '#1a1a2e', particles: 'snow', btnStyle: 'glass' },
  { id: 'terracotta', name: 'Terracotta', bg: '#f5f0eb', btn: '#c77b58', text: '#ffffff', particles: 'none', btnStyle: 'soft' },
]

const particleEffects = [
  { id: 'none', name: 'None', emoji: '✕' },
  { id: 'confetti', name: 'Confetti', emoji: '🎉' },
  { id: 'stars', name: 'Stars', emoji: '✨' },
  { id: 'bubbles', name: 'Bubbles', emoji: '🫧' },
  { id: 'snow', name: 'Snow', emoji: '❄️' },
  { id: 'hearts', name: 'Hearts', emoji: '💕' },
]

const buttonStyles = [
  { id: 'rounded', name: 'Rounded', class: 'rounded-full' },
  { id: 'square', name: 'Square', class: 'rounded-none' },
  { id: 'soft', name: 'Soft', class: 'rounded-lg' },
  { id: 'glass', name: 'Glass', class: 'rounded-xl glass' },
]

export function AppearanceEditor({ profile, user, links, isPro }: AppearanceEditorProps) {
  const [settings, setSettings] = useState({
    backgroundColor: profile.backgroundColor,
    buttonStyle: profile.buttonStyle,
    buttonColor: profile.buttonColor,
    textColor: profile.textColor,
    theme: profile.theme,
    particleEffect: profile.particleEffect || 'none',
    bio: user.bio || '',
    title: user.name || '',
    image: user.image || '',
    socialInstagram: profile.socialInstagram || '',
    socialTwitter: profile.socialTwitter || '',
    socialYoutube: profile.socialYoutube || '',
    socialTiktok: profile.socialTiktok || '',
    socialLinkedin: profile.socialLinkedin || '',
    socialGithub: profile.socialGithub || '',
    socialWebsite: profile.socialWebsite || '',
    socialWhatsapp: profile.socialWhatsapp || '',
    socialEmail: profile.socialEmail || '',
    emailCaptureEnabled: profile.emailCaptureEnabled || false,
    emailCaptureTitle: profile.emailCaptureTitle || '',
    emailCaptureText: profile.emailCaptureText || '',
    tipJarEnabled: profile.tipJarEnabled || false,
    tipJarUpiId: profile.tipJarUpiId || '',
    tipJarText: profile.tipJarText || '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB')
      return
    }

    setIsUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload image')

      const data = await response.json()
      setSettings({ ...settings, image: data.url })
      toast.success('Image uploaded!')
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleThemeSelect = (theme: typeof themes[0]) => {
    setSettings({
      ...settings,
      theme: theme.id,
      backgroundColor: theme.bg,
      buttonColor: theme.btn,
      textColor: theme.text,
      particleEffect: theme.particles,
      buttonStyle: theme.btnStyle,
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error('Failed to save')
      toast.success('Appearance saved!')
    } catch (error) {
      toast.error('Failed to save appearance')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Settings */}
      <div className="space-y-6">
        {/* Profile Info */}
        <Card className="border-[#e8e4de] bg-white">
          <CardHeader>
            <CardTitle className="text-[#2d3029]">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#2d3029]">Profile Picture</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div
                  className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#f5f2ed] to-[#e8e4de] flex items-center justify-center cursor-pointer group shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {settings.image ? (
                    <img
                      src={settings.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-[#a8a8a3]" />
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="rounded-xl border-[#e8e4de] text-[#2d3029] hover:bg-[#f5f2ed] hover:border-[#7c9885]"
                  >
                    {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  {settings.image && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSettings({ ...settings, image: '' })}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#2d3029]">Display Name</label>
              <Input
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#2d3029]">Bio</label>
              <Input
                value={settings.bio}
                onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                placeholder="A short bio about yourself"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border-[#e8e4de] bg-white">
          <CardHeader>
            <CardTitle className="text-[#2d3029]">Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-pink-500 shrink-0" />
              <Input
                value={settings.socialInstagram}
                onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                placeholder="Instagram username"
              />
            </div>
            <div className="flex items-center gap-3">
              <Twitter className="w-5 h-5 text-blue-400 shrink-0" />
              <Input
                value={settings.socialTwitter}
                onChange={(e) => setSettings({ ...settings, socialTwitter: e.target.value })}
                placeholder="Twitter/X username"
              />
            </div>
            <div className="flex items-center gap-3">
              <Youtube className="w-5 h-5 text-red-500 shrink-0" />
              <Input
                value={settings.socialYoutube}
                onChange={(e) => setSettings({ ...settings, socialYoutube: e.target.value })}
                placeholder="YouTube channel URL"
              />
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              <Input
                value={settings.socialTiktok}
                onChange={(e) => setSettings({ ...settings, socialTiktok: e.target.value })}
                placeholder="TikTok username"
              />
            </div>
            <div className="flex items-center gap-3">
              <Linkedin className="w-5 h-5 text-blue-600 shrink-0" />
              <Input
                value={settings.socialLinkedin}
                onChange={(e) => setSettings({ ...settings, socialLinkedin: e.target.value })}
                placeholder="LinkedIn profile URL"
              />
            </div>
            <div className="flex items-center gap-3">
              <Github className="w-5 h-5 shrink-0" />
              <Input
                value={settings.socialGithub}
                onChange={(e) => setSettings({ ...settings, socialGithub: e.target.value })}
                placeholder="GitHub username"
              />
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-green-500 shrink-0" />
              <Input
                value={settings.socialWebsite}
                onChange={(e) => setSettings({ ...settings, socialWebsite: e.target.value })}
                placeholder="Website URL"
              />
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <Input
                value={settings.socialWhatsapp}
                onChange={(e) => setSettings({ ...settings, socialWhatsapp: e.target.value })}
                placeholder="WhatsApp number (with country code)"
              />
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-red-500 shrink-0" />
              <Input
                value={settings.socialEmail}
                onChange={(e) => setSettings({ ...settings, socialEmail: e.target.value })}
                placeholder="Email address"
              />
            </div>
          </CardContent>
        </Card>

        {/* Themes */}
        <Card className="border-[#e8e4de] bg-white">
          <CardHeader>
            <CardTitle className="text-[#2d3029]">Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    settings.theme === theme.id
                      ? 'border-[#7c9885] ring-2 ring-[#7c9885]/20'
                      : 'border-[#e8e4de] hover:border-[#7c9885]/50'
                  }`}
                  style={{ backgroundColor: theme.bg }}
                >
                  <div
                    className="h-8 rounded-full mb-2"
                    style={{ backgroundColor: theme.btn }}
                  />
                  <p className="text-xs font-medium" style={{ color: theme.btn }}>
                    {theme.name}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Button Style */}
        <Card className="border-[#e8e4de] bg-white">
          <CardHeader>
            <CardTitle className="text-[#2d3029]">Button Style</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {buttonStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSettings({ ...settings, buttonStyle: style.id })}
                  className={`py-3 px-2 border-2 transition-all text-[#2d3029] text-sm font-medium rounded-xl ${
                    settings.buttonStyle === style.id
                      ? 'border-[#7c9885] bg-[#7c9885]/10'
                      : 'border-[#e8e4de] hover:border-[#7c9885]/50'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Particle Effects */}
        <Card className="border-[#e8e4de] bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2d3029]">
              Particle Effects
              <span className="text-xs bg-[#c77b58] text-white px-2 py-0.5 rounded-full">
                New
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {particleEffects.map((effect) => (
                <button
                  key={effect.id}
                  onClick={() => setSettings({ ...settings, particleEffect: effect.id })}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    settings.particleEffect === effect.id
                      ? 'border-[#7c9885] bg-[#7c9885]/10 ring-2 ring-[#7c9885]/20'
                      : 'border-[#e8e4de] hover:border-[#7c9885]/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{effect.emoji}</div>
                  <p className="text-xs font-medium text-[#2d3029]">{effect.name}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Colors - Pro only */}
        <Card className={`border-[#e8e4de] bg-white ${!isPro ? 'opacity-75' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2d3029]">
              Custom Colors
              {!isPro && (
                <span className="text-xs bg-[#7c9885]/20 text-[#7c9885] px-2 py-1 rounded-full">
                  Pro
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#2d3029]">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) =>
                    setSettings({ ...settings, backgroundColor: e.target.value })
                  }
                  disabled={!isPro}
                  className="w-12 h-10 rounded cursor-pointer disabled:cursor-not-allowed"
                />
                <Input
                  value={settings.backgroundColor}
                  onChange={(e) =>
                    setSettings({ ...settings, backgroundColor: e.target.value })
                  }
                  disabled={!isPro}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#2d3029]">Button Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.buttonColor}
                  onChange={(e) =>
                    setSettings({ ...settings, buttonColor: e.target.value })
                  }
                  disabled={!isPro}
                  className="w-12 h-10 rounded cursor-pointer disabled:cursor-not-allowed"
                />
                <Input
                  value={settings.buttonColor}
                  onChange={(e) =>
                    setSettings({ ...settings, buttonColor: e.target.value })
                  }
                  disabled={!isPro}
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Tools - Pro Feature */}
        <Card className={`border-[#e8e4de] bg-white ${!isPro ? 'opacity-75' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2d3029]">
              Growth Tools
              {!isPro && (
                <span className="text-xs bg-[#7c9885]/20 text-[#7c9885] px-2 py-1 rounded-full">
                  Pro
                </span>
              )}
              <span className="text-xs bg-[#c77b58]/20 text-[#c77b58] px-2 py-1 rounded-full ml-auto">
                New
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Capture */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-[#2d3029]">Email Capture</label>
                  <p className="text-xs text-[#6b6b66]">Collect visitor emails</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailCaptureEnabled}
                    onChange={(e) => setSettings({ ...settings, emailCaptureEnabled: e.target.checked })}
                    disabled={!isPro}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#e8e4de] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7c9885]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#e8e4de] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c9885] peer-disabled:opacity-50"></div>
                </label>
              </div>
              {settings.emailCaptureEnabled && (
                <div className="space-y-2 pl-4 border-l-2 border-[#7c9885]/30">
                  <Input
                    value={settings.emailCaptureTitle}
                    onChange={(e) => setSettings({ ...settings, emailCaptureTitle: e.target.value })}
                    placeholder="Title (e.g., Stay Updated)"
                    disabled={!isPro}
                  />
                  <Input
                    value={settings.emailCaptureText}
                    onChange={(e) => setSettings({ ...settings, emailCaptureText: e.target.value })}
                    placeholder="Description (e.g., Get exclusive content)"
                    disabled={!isPro}
                  />
                </div>
              )}
            </div>

            {/* Tip Jar / UPI */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-[#2d3029]">Tip Jar (UPI)</label>
                  <p className="text-xs text-[#6b6b66]">Accept tips via UPI</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.tipJarEnabled}
                    onChange={(e) => setSettings({ ...settings, tipJarEnabled: e.target.checked })}
                    disabled={!isPro}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#e8e4de] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7c9885]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#e8e4de] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c9885] peer-disabled:opacity-50"></div>
                </label>
              </div>
              {settings.tipJarEnabled && (
                <div className="space-y-2 pl-4 border-l-2 border-[#7c9885]/30">
                  <Input
                    value={settings.tipJarUpiId}
                    onChange={(e) => setSettings({ ...settings, tipJarUpiId: e.target.value })}
                    placeholder="Your UPI ID (e.g., name@upi)"
                    disabled={!isPro}
                  />
                  <Input
                    value={settings.tipJarText}
                    onChange={(e) => setSettings({ ...settings, tipJarText: e.target.value })}
                    placeholder="Message (e.g., Buy me a coffee!)"
                    disabled={!isPro}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} isLoading={isLoading} className="w-full bg-[#7c9885] hover:bg-[#6b8872] text-white rounded-xl">
          Save Changes
        </Button>
      </div>

      {/* Preview */}
      <div className="lg:sticky lg:top-8">
        <Card className="border-[#e8e4de] bg-white">
          <CardHeader>
            <CardTitle className="text-[#2d3029]">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <ProfilePreview
                username={user.username || 'yourname'}
                title={settings.title}
                bio={settings.bio}
                links={links}
                backgroundColor={settings.backgroundColor}
                buttonColor={settings.buttonColor}
                textColor={settings.textColor}
                buttonStyle={settings.buttonStyle}
                particleEffect={settings.particleEffect}
                image={settings.image}
                socialLinks={{
                  instagram: settings.socialInstagram,
                  twitter: settings.socialTwitter,
                  youtube: settings.socialYoutube,
                  tiktok: settings.socialTiktok,
                  linkedin: settings.socialLinkedin,
                  github: settings.socialGithub,
                  website: settings.socialWebsite,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
