'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

export function DeleteAccountButton() {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      toast.success('Account deleted successfully')
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      toast.error('Failed to delete account')
    } finally {
      setIsLoading(false)
    }
  }

  if (isConfirming) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 mb-3">
            This action is <strong>permanent</strong> and cannot be undone. All your data including links, analytics, and profile will be deleted.
          </p>
          <label className="block text-sm font-medium text-red-800 mb-2">
            Type <strong>DELETE</strong> to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-3 py-2 border border-red-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="DELETE"
          />
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleDelete}
            disabled={confirmText !== 'DELETE' || isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
            isLoading={isLoading}
          >
            Delete My Account
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsConfirming(false)
              setConfirmText('')
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
    >
      Delete Account
    </button>
  )
}
