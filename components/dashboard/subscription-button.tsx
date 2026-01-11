'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface SubscriptionButtonProps {
  isPro: boolean
}

export function SubscriptionButton({ isPro }: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else if (response.status === 503) {
        toast.error('Payments are not configured yet. Please contact the administrator.')
      } else {
        throw new Error(data.error || 'Something went wrong')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to start checkout')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} isLoading={isLoading} variant={isPro ? 'outline' : 'default'}>
      {isPro ? 'Manage Subscription' : 'Upgrade to Pro'}
    </Button>
  )
}
