'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Plus,
  GripVertical,
  Trash2,
  ExternalLink,
  Edit2,
  Check,
  X,
  Eye,
  EyeOff,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface LinkItem {
  id: string
  title: string
  url: string
  isActive: boolean
  clicks: number
  order: number
}

interface LinksManagerProps {
  initialLinks: LinkItem[]
  maxLinks: number
  isPro: boolean
}

export function LinksManager({ initialLinks, maxLinks, isPro }: LinksManagerProps) {
  const [links, setLinks] = useState(initialLinks)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newLink, setNewLink] = useState({ title: '', url: '' })

  const canAddMore = links.length < maxLinks

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) {
      toast.error('Please fill in all fields')
      return
    }

    let url = newLink.url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newLink.title,
          url,
          order: links.length,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add link')
      }

      const link = await response.json()
      setLinks([...links, link])
      setNewLink({ title: '', url: '' })
      setIsAdding(false)
      toast.success('Link added!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateLink = async (id: string, data: Partial<LinkItem>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update link')

      const updatedLink = await response.json()
      setLinks(links.map((l) => (l.id === id ? updatedLink : l)))
      setEditingId(null)
      toast.success('Link updated!')
    } catch (error) {
      toast.error('Failed to update link')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete link')

      setLinks(links.filter((l) => l.id !== id))
      toast.success('Link deleted!')
    } catch (error) {
      toast.error('Failed to delete link')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await handleUpdateLink(id, { isActive: !isActive })
  }

  return (
    <div className="space-y-4">
      {/* Add Link Button */}
      {!isAdding && (
        <Button
          onClick={() => setIsAdding(true)}
          disabled={!canAddMore}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Link
          {!canAddMore && !isPro && (
            <span className="ml-2 text-xs opacity-75">
              (Upgrade to Pro for unlimited links)
            </span>
          )}
        </Button>
      )}

      {/* Add Link Form */}
      {isAdding && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <Input
              placeholder="Link Title (e.g., My Website)"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
            />
            <Input
              placeholder="URL (e.g., https://example.com)"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddLink} isLoading={isLoading}>
                <Check className="w-4 h-4 mr-2" />
                Add Link
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false)
                  setNewLink({ title: '', url: '' })
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Links List */}
      <div className="space-y-3">
        {links.length === 0 && !isAdding ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <p>No links yet. Click "Add Link" to create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              isEditing={editingId === link.id}
              onEdit={() => setEditingId(link.id)}
              onCancelEdit={() => setEditingId(null)}
              onUpdate={(data) => handleUpdateLink(link.id, data)}
              onDelete={() => handleDeleteLink(link.id)}
              onToggleActive={() => handleToggleActive(link.id, link.isActive)}
              isLoading={isLoading}
            />
          ))
        )}
      </div>

      {/* Upgrade prompt */}
      {!isPro && links.length >= 3 && (
        <Card className="bg-gradient-to-r from-primary-500 to-purple-500 text-white">
          <CardContent className="p-6 text-center">
            <h3 className="font-bold text-lg mb-2">Want unlimited links?</h3>
            <p className="mb-4 opacity-90">
              Upgrade to Pro for unlimited links, custom themes, and more!
            </p>
            <Link href="/settings">
              <Button className="bg-white text-primary-600 hover:bg-gray-100">
                Upgrade to Pro - $5/month
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface LinkCardProps {
  link: LinkItem
  isEditing: boolean
  onEdit: () => void
  onCancelEdit: () => void
  onUpdate: (data: Partial<LinkItem>) => void
  onDelete: () => void
  onToggleActive: () => void
  isLoading: boolean
}

function LinkCard({
  link,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  onToggleActive,
  isLoading,
}: LinkCardProps) {
  const [editData, setEditData] = useState({ title: link.title, url: link.url })

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <Input
            placeholder="Link Title"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />
          <Input
            placeholder="URL"
            value={editData.url}
            onChange={(e) => setEditData({ ...editData, url: e.target.value })}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onUpdate(editData)}
              isLoading={isLoading}
            >
              <Check className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={onCancelEdit}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={!link.isActive ? 'opacity-60' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{link.title}</p>
            <p className="text-sm text-gray-500 truncate">{link.url}</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>{link.clicks} clicks</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={onToggleActive}
              title={link.isActive ? 'Hide link' : 'Show link'}
            >
              {link.isActive ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </Button>
            <Button size="icon" variant="ghost" onClick={onEdit}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <Button size="icon" variant="ghost">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
            <Button
              size="icon"
              variant="ghost"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
