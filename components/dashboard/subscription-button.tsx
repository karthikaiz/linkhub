'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

interface SubscriptionButtonProps {
  isPro: boolean
  subscriptionEndDate?: Date | null
}

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any
  }
}

export function SubscriptionButton({ isPro, subscriptionEndDate }: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleCancelSubscription = async () => {
    setIsCancelling(true)
    try {
      const response = await fetch('/api/razorpay/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription')
      }

      toast.success('Subscription cancelled. You\'ll have access until the end of your billing period.')
      setShowManageModal(false)
      setTimeout(() => window.location.reload(), 1500)
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel subscription')
    } finally {
      setIsCancelling(false)
    }
  }

  const handleClick = async () => {
    if (isPro) {
      setShowManageModal(true)
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      <Button onClick={handleClick} isLoading={isLoading} variant={isPro ? 'outline' : 'default'}>
        {isPro ? 'Manage Subscription' : 'Upgrade to Pro'}
      </Button>

      {/* Manage Subscription Modal */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowManageModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <button
              onClick={() => setShowManageModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4">Manage Subscription</h2>

            <div className="space-y-4">
              {/* Current Plan */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-600 font-semibold">Pro Plan</span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                {subscriptionEndDate && (
                  <p className="text-sm text-gray-600">
                    Next billing: {formatDate(subscriptionEndDate)}
                  </p>
                )}
              </div>

              {/* Features */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Your Pro benefits:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Unlimited links</li>
                  <li>• Custom themes & colors</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                </ul>
              </div>

              {/* Cancel Section */}
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-3">
                  If you cancel, you&apos;ll still have Pro access until your current billing period ends.
                </p>
                <Button
                  variant="outline"
                  onClick={handleCancelSubscription}
                  isLoading={isCancelling}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
