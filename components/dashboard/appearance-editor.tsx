'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { ProfilePreview } from './profile-preview'

interface Profile {
  id: string
  backgroundColor: string
  buttonStyle: string
  buttonColor: string
  textColor: string
  fontFamily: string
  theme: string
}

interface User {
  username: string | null
  name: string | null
  bio: string | null
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
  })
  const [isLoading, setIsLoading] = useState(false)

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
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
