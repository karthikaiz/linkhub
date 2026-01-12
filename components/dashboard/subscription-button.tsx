'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface SubscriptionButtonProps {
  isPro: boolean
}

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any
  }
}

export function SubscriptionButton({ isPro }: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleClick = async () => {
    if (isPro) {
      // TODO: Implement manage subscription (Razorpay doesn't have a billing portal)
      // You can redirect to a custom settings page or show subscription details
      toast.success('Manage your subscription in Settings')
      return
    }

    setIsLoading(true)
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK')
      }

      // Create order/subscription
      const response = await fetch('/api/razorpay/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 503) {
          toast.error('Payments are not configured yet. Please contact the administrator.')
          return
        }
        throw new Error(data.error || 'Something went wrong')
      }

      // Configure Razorpay checkout options
      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        order_id: data.orderId,
        amount: data.amount * 100, // Convert to paise/cents
        currency: data.currency,
        name: 'LinkHub',
        description: 'Pro Plan Subscription',
        image: '/logo.png', // Add your logo
        handler: async function (response: any) {
          try {
            // Verify payment on server
            const verifyResponse = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                razorpay_subscription_id: response.razorpay_subscription_id,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              toast.success('Payment successful! Welcome to Pro 🎉')
              // Reload page to update UI
              setTimeout(() => window.location.reload(), 1500)
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error: any) {
            toast.error(error.message || 'Payment verification failed')
          }
        },
        prefill: {
          name: '',
          email: '',
        },
        notes: {
          plan: 'pro',
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false)
          },
        },
      }

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      console.error('Checkout error:', error)
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
