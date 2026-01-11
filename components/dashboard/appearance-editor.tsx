'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { ProfilePreview } from './profile-preview'
import { Camera, Instagram, Twitter, Youtube, Linkedin, Github, Globe } from 'lucide-react'

interface Profile {
  id: string
  backgroundColor: string
  buttonStyle: string
  buttonColor: string
  textColor: string
  fontFamily: string
  theme: string
  socialInstagram?: string | null
  socialTwitter?: string | null
  socialYoutube?: string | null
  socialTiktok?: string | null
  socialLinkedin?: string | null
  socialGithub?: string | null
  socialWebsite?: string | null
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
  { id: 'light', name: 'Light', bg: '#ffffff', btn: '#000000', text: '#ffffff' },
  { id: 'dark', name: 'Dark', bg: '#1a1a2e', btn: '#ffffff', text: '#000000' },
  { id: 'ocean', name: 'Ocean', bg: '#0077b6', btn: '#ffffff', text: '#0077b6' },
  { id: 'sunset', name: 'Sunset', bg: '#ff6b6b', btn: '#ffffff', text: '#ff6b6b' },
  { id: 'forest', name: 'Forest', bg: '#2d6a4f', btn: '#ffffff', text: '#2d6a4f' },
  { id: 'lavender', name: 'Lavender', bg: '#7b68ee', btn: '#ffffff', text: '#7b68ee' },
]

const buttonStyles = [
  { id: 'rounded', name: 'Rounded', class: 'rounded-full' },
  { id: 'square', name: 'Square', class: 'rounded-none' },
  { id: 'soft', name: 'Soft', class: 'rounded-lg' },
]

export function AppearanceEditor({ profile, user, links, isPro }: AppearanceEditorProps) {
  const [settings, setSettings] = useState({
    backgroundColor: profile.backgroundColor,
    buttonStyle: profile.buttonStyle,
    buttonColor: profile.buttonColor,
    textColor: profile.textColor,
    theme: profile.theme,
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

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
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
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Profile Picture</label>
              <div className="flex items-center gap-4">
                <div
                  className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {settings.image ? (
                    <img
                      src={settings.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
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
                  >
                    {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  {settings.image && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSettings({ ...settings, image: '' })}
                      className="ml-2 text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <Input
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <Input
                value={settings.bio}
                onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                placeholder="A short bio about yourself"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-pink-500" />
              <Input
                value={settings.socialInstagram}
                onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                placeholder="Instagram username"
              />
            </div>
            <div className="flex items-center gap-3">
              <Twitter className="w-5 h-5 text-blue-400" />
              <Input
                value={settings.socialTwitter}
                onChange={(e) => setSettings({ ...settings, socialTwitter: e.target.value })}
                placeholder="Twitter/X username"
              />
            </div>
            <div className="flex items-center gap-3">
              <Youtube className="w-5 h-5 text-red-500" />
              <Input
                value={settings.socialYoutube}
                onChange={(e) => setSettings({ ...settings, socialYoutube: e.target.value })}
                placeholder="YouTube channel URL"
              />
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              <Input
                value={settings.socialTiktok}
                onChange={(e) => setSettings({ ...settings, socialTiktok: e.target.value })}
                placeholder="TikTok username"
              />
            </div>
            <div className="flex items-center gap-3">
              <Linkedin className="w-5 h-5 text-blue-600" />
              <Input
                value={settings.socialLinkedin}
                onChange={(e) => setSettings({ ...settings, socialLinkedin: e.target.value })}
                placeholder="LinkedIn profile URL"
              />
            </div>
            <div className="flex items-center gap-3">
              <Github className="w-5 h-5" />
              <Input
                value={settings.socialGithub}
                onChange={(e) => setSettings({ ...settings, socialGithub: e.target.value })}
                placeholder="GitHub username"
              />
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-green-500" />
              <Input
                value={settings.socialWebsite}
                onChange={(e) => setSettings({ ...settings, socialWebsite: e.target.value })}
                placeholder="Website URL"
              />
            </div>
          </CardContent>
        </Card>

        {/* Themes */}
        <Card>
          <CardHeader>
            <CardTitle>Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.theme === theme.id
                      ? 'border-primary-500 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-gray-300'
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
        <Card>
          <CardHeader>
            <CardTitle>Button Style</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {buttonStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSettings({ ...settings, buttonStyle: style.id })}
                  className={`flex-1 py-3 px-4 border-2 transition-all ${style.class} ${
                    settings.buttonStyle === style.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Colors - Pro only */}
        <Card className={!isPro ? 'opacity-75' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Custom Colors
              {!isPro && (
                <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                  Pro
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
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
              <label className="block text-sm font-medium mb-2">Button Color</label>
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

        <Button onClick={handleSave} isLoading={isLoading} className="w-full">
          Save Changes
        </Button>
      </div>

      {/* Preview */}
      <div className="lg:sticky lg:top-8">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
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
