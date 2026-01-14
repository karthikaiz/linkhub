import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { razorpay } from '@/lib/razorpay'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's subscription ID
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        razorpaySubscriptionId: true,
        subscriptionEndDate: true,
      },
    })

    if (!user?.razorpaySubscriptionId) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 })
    }

    // Cancel subscription in Razorpay
    // This will cancel at the end of the current billing period
    // Second parameter: true/1 = cancel at cycle end, false/0 = cancel immediately
    try {
      await razorpay.subscriptions.cancel(user.razorpaySubscriptionId, true)
    } catch (razorpayError: any) {
      console.error('Razorpay cancel error:', razorpayError)
      // If subscription is already cancelled or not found in Razorpay, continue
      if (!razorpayError.error?.description?.includes('already cancelled')) {
        // Don't throw, just log - we'll still update our DB
        console.warn('Razorpay subscription may already be cancelled')
      }
    }

    // Update user record - keep subscriptionEndDate so they have access until then
    // but clear the subscription ID to mark it as cancelled
    await db.user.update({
      where: { id: session.user.id },
      data: {
        // Keep subscriptionEndDate - they get access until then
        // Clear subscription ID to mark as cancelled
        razorpaySubscriptionId: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled',
      accessUntil: user.subscriptionEndDate,
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
