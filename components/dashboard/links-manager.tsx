'use client'

import { useState, useRef } from 'react'
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
  type: string
  embedUrl: string | null
}

const LINK_TYPES = [
  { id: 'link', name: 'Regular Link', icon: '🔗' },
  { id: 'youtube', name: 'YouTube Video', icon: '📺' },
  { id: 'spotify', name: 'Spotify', icon: '🎵' },
  { id: 'tiktok', name: 'TikTok', icon: '🎬' },
]

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
  const [newLink, setNewLink] = useState({ title: '', url: '', type: 'link', embedUrl: '' })
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

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

    // For embed types, also ensure embedUrl is set
    let embedUrl = newLink.embedUrl || url
    if (newLink.type !== 'link' && !embedUrl.startsWith('http')) {
      embedUrl = 'https://' + embedUrl
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
          type: newLink.type,
          embedUrl: newLink.type !== 'link' ? embedUrl : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add link')
      }

      const link = await response.json()
      setLinks([...links, link])
      setNewLink({ title: '', url: '', type: 'link', embedUrl: '' })
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

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    // Reorder links
    const newLinks = [...links]
    const [draggedLink] = newLinks.splice(draggedIndex, 1)
    newLinks.splice(dropIndex, 0, draggedLink)

    // Update order values
    const reorderedLinks = newLinks.map((link, index) => ({
      ...link,
      order: index,
    }))

    setLinks(reorderedLinks)
    setDraggedIndex(null)
    setDragOverIndex(null)

    // Save new order to backend
    try {
      await Promise.all(
        reorderedLinks.map((link) =>
          fetch(`/api/links/${link.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: link.order }),
          })
        )
      )
      toast.success('Links reordered!')
    } catch (error) {
      toast.error('Failed to save order')
      // Revert on error
      setLinks(links)
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
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
            {/* Link Type Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Link Type</label>
              <div className="grid grid-cols-4 gap-2">
                {LINK_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setNewLink({ ...newLink, type: type.id })}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      newLink.type === type.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{type.icon}</span>
                    <p className="text-xs mt-1">{type.name}</p>
                  </button>
                ))}
              </div>
            </div>
            <Input
              placeholder="Title (e.g., My Latest Video)"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
            />
            {newLink.type === 'link' ? (
              <Input
                placeholder="URL (e.g., https://example.com)"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              />
            ) : (
              <div>
                <Input
                  placeholder={
                    newLink.type === 'youtube'
                      ? 'https://youtube.com/watch?v=...'
                      : newLink.type === 'spotify'
                      ? 'https://open.spotify.com/track/...'
                      : 'https://tiktok.com/@user/video/...'
                  }
                  value={newLink.embedUrl}
                  onChange={(e) => setNewLink({ ...newLink, embedUrl: e.target.value, url: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be embedded directly on your profile
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleAddLink} isLoading={isLoading}>
                <Check className="w-4 h-4 mr-2" />
                Add Link
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false)
                  setNewLink({ title: '', url: '', type: 'link', embedUrl: '' })
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
          links.map((link, index) => (
            <div
              key={link.id}
              draggable={!editingId}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`transition-all ${
                draggedIndex === index ? 'opacity-50' : ''
              } ${
                dragOverIndex === index
                  ? 'border-t-2 border-primary-500 pt-2'
                  : ''
              }`}
            >
              <LinkCard
                link={link}
                isEditing={editingId === link.id}
                onEdit={() => setEditingId(link.id)}
                onCancelEdit={() => setEditingId(null)}
                onUpdate={(data) => handleUpdateLink(link.id, data)}
                onDelete={() => handleDeleteLink(link.id)}
                onToggleActive={() => handleToggleActive(link.id, link.isActive)}
                isLoading={isLoading}
                isDragging={draggedIndex !== null}
              />
            </div>
          ))
        )}
      </div>

      {/* Upgrade prompt */}
      {!isPro && links.length >= 3 && (
        <Card className="bg-gray-900 text-white border-0 shadow-xl">
          <CardContent className="p-6 text-center">
            <h3 className="font-bold text-lg mb-2">Want unlimited links?</h3>
            <p className="mb-4 opacity-80">
              Upgrade to Pro for unlimited links, custom themes, and more!
            </p>
            <Link href="/settings">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg">
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
  isDragging: boolean
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
  isDragging,
}: LinkCardProps) {
  const [editData, setEditData] = useState({
    title: link.title,
    url: link.url,
    type: link.type || 'link',
    embedUrl: link.embedUrl || '',
  })

  const linkType = LINK_TYPES.find((t) => t.id === link.type) || LINK_TYPES[0]

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Link Type Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Link Type</label>
            <div className="grid grid-cols-4 gap-2">
              {LINK_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setEditData({ ...editData, type: type.id })}
                  className={`p-2 rounded-lg border-2 text-center transition-all ${
                    editData.type === type.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{type.icon}</span>
                  <p className="text-xs mt-1">{type.name}</p>
                </button>
              ))}
            </div>
          </div>
          <Input
            placeholder="Title"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />
          {editData.type === 'link' ? (
            <Input
              placeholder="URL"
              value={editData.url}
              onChange={(e) => setEditData({ ...editData, url: e.target.value })}
            />
          ) : (
            <div>
              <Input
                placeholder={
                  editData.type === 'youtube'
                    ? 'https://youtube.com/watch?v=...'
                    : editData.type === 'spotify'
                    ? 'https://open.spotify.com/track/...'
                    : 'https://tiktok.com/@user/video/...'
                }
                value={editData.embedUrl}
                onChange={(e) => setEditData({ ...editData, embedUrl: e.target.value, url: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be embedded directly on your profile
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onUpdate({
                title: editData.title,
                url: editData.url,
                type: editData.type,
                embedUrl: editData.type !== 'link' ? editData.embedUrl : null,
              })}
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
      <CardContent className="p-3 sm:p-4">
        {/* Mobile Layout */}
        <div className="sm:hidden">
          <div className="flex items-start gap-2">
            <GripVertical
              className={`w-5 h-5 text-gray-400 shrink-0 mt-1 ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span title={linkType.name}>{linkType.icon}</span>
                <p className="font-medium truncate text-sm">{link.title}</p>
              </div>
              <p className="text-xs text-gray-500 truncate mb-2">{link.url}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{link.clicks} clicks</span>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onToggleActive}
                    className="h-8 w-8"
                  >
                    {link.isActive ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={onEdit} className="h-8 w-8">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onDelete}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center gap-4">
          <GripVertical
            className={`w-5 h-5 text-gray-400 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span title={linkType.name}>{linkType.icon}</span>
              <p className="font-medium truncate">{link.title}</p>
            </div>
            <p className="text-sm text-gray-500 truncate">{link.url}</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 shrink-0">
            <span>{link.clicks} clicks</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
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
