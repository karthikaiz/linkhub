'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { X, RefreshCw } from 'lucide-react'

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
  const [showPaymentPendingModal, setShowPaymentPendingModal] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

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

  // Poll for payment status in background
  const startPaymentPolling = () => {
    let pollCount = 0
    const maxPolls = 60 // Poll for max 2 minutes (60 * 2 seconds)

    const pollInterval = setInterval(async () => {
      pollCount++
      console.log(`Polling for payment status... (attempt ${pollCount})`)

      try {
        const response = await fetch('/api/user/subscription-status')
        const data = await response.json()

        if (data.isPro) {
          console.log('Payment confirmed via polling!')
          clearInterval(pollInterval)
          toast.success('Payment successful! Welcome to Pro!')
          setTimeout(() => window.location.reload(), 1000)
        }
      } catch (error) {
        console.log('Polling error:', error)
        // Silently fail - we'll keep polling
      }

      // Stop after max attempts
      if (pollCount >= maxPolls) {
        clearInterval(pollInterval)
      }
    }, 2000) // Check every 2 seconds (more frequent for UPI)

    return pollInterval
  }

  const handleClick = async () => {
    if (isPro) {
      setShowManageModal(true)
      return
    }

    setIsLoading(true)
    let pollingInterval: NodeJS.Timeout | null = null

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

      // Start polling for payment status (for UPI payments that complete outside modal)
      pollingInterval = startPaymentPolling()

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
          // Stop polling since handler was called
          if (pollingInterval) clearInterval(pollingInterval)

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
          color: '#7c9885',
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false)
            // Show payment pending modal in case user paid via UPI but closed the modal
            setShowPaymentPendingModal(true)
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

  const checkPaymentStatus = async () => {
    setIsCheckingStatus(true)
    try {
      // Simply reload the page - if the webhook processed the payment,
      // the user's subscription status will be updated
      const response = await fetch('/api/user/subscription-status')
      const data = await response.json()

      if (data.isPro) {
        toast.success('Payment confirmed! Welcome to Pro!')
        setTimeout(() => window.location.reload(), 1000)
      } else {
        toast.error('Payment not yet received. Please wait a moment and try again.')
      }
    } catch (error) {
      // Just reload the page as a fallback
      window.location.reload()
    } finally {
      setIsCheckingStatus(false)
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
      <Button
        onClick={handleClick}
        isLoading={isLoading}
        variant={isPro ? 'outline' : 'default'}
        className={isPro ? 'rounded-xl border-[#e8e4de] text-[#2d3029] hover:bg-[#f5f2ed] hover:border-[#7c9885]' : 'bg-[#7c9885] hover:bg-[#6b8872] text-white rounded-xl'}
      >
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-[#e8e4de]">
            <button
              onClick={() => setShowManageModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#f5f2ed] text-[#6b6b66]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 text-[#2d3029]">Manage Subscription</h2>

            <div className="space-y-4">
              {/* Current Plan */}
              <div className="p-4 bg-[#7c9885]/10 rounded-xl border border-[#7c9885]/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#7c9885] font-semibold">Pro Plan</span>
                  <span className="bg-[#7c9885]/20 text-[#7c9885] text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                {subscriptionEndDate && (
                  <p className="text-sm text-[#6b6b66]">
                    Next billing: {formatDate(subscriptionEndDate)}
                  </p>
                )}
              </div>

              {/* Features */}
              <div>
                <p className="text-sm font-medium text-[#2d3029] mb-2">Your Pro benefits:</p>
                <ul className="text-sm text-[#6b6b66] space-y-1">
                  <li>• Unlimited links</li>
                  <li>• Custom themes & colors</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                </ul>
              </div>

              {/* Cancel Section */}
              <div className="pt-4 border-t border-[#e8e4de]">
                <p className="text-sm text-[#6b6b66] mb-3">
                  If you cancel, you&apos;ll still have Pro access until your current billing period ends.
                </p>
                <Button
                  variant="outline"
                  onClick={handleCancelSubscription}
                  isLoading={isCancelling}
                  className="w-full text-red-500 border-red-200 hover:bg-red-50 rounded-xl"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Pending Modal - shown after UPI payment modal is closed */}
      {showPaymentPendingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowPaymentPendingModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-[#e8e4de]">
            <button
              onClick={() => setShowPaymentPendingModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#f5f2ed] text-[#6b6b66]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-2 text-[#2d3029]">Did you complete the payment?</h2>
            <p className="text-[#6b6b66] mb-6">
              If you paid via UPI, PhonePe, or QR code, it may take 10-30 seconds for the payment to be confirmed. We&apos;re checking automatically in the background.
            </p>

            <div className="space-y-3">
              <Button
                onClick={checkPaymentStatus}
                isLoading={isCheckingStatus}
                className="w-full bg-[#7c9885] hover:bg-[#6b8872] text-white rounded-xl"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Payment Status
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowPaymentPendingModal(false)}
                className="w-full rounded-xl border-[#e8e4de] text-[#6b6b66] hover:bg-[#f5f2ed]"
              >
                I haven&apos;t paid yet
              </Button>
            </div>

            <p className="text-xs text-[#a8a8a3] mt-4 text-center">
              UPI payments typically take 10-60 seconds to process. The page will automatically refresh when your payment is confirmed.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
