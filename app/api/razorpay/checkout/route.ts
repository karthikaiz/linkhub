import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { razorpay, PLAN_PRICES, RAZORPAY_PLANS } from '@/lib/razorpay'
import { detectCurrency, getCountryCode } from '@/lib/geo'

export async function POST() {
  try {
    // Check if Razorpay is configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        {
          error:
            'Razorpay is not configured. Please set up RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables.',
        },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        razorpayCustomerId: true,
        razorpaySubscriptionId: true,
        currency: true,
        country: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Detect currency based on user's location
    const currency = await detectCurrency()
    const country = await getCountryCode()

    // Get plan price for the detected currency
    const amount = PLAN_PRICES[currency].pro
    const planId = RAZORPAY_PLANS[currency]?.pro

    // Create Razorpay subscription
    // Note: For subscriptions, you need to create a plan in Razorpay dashboard first
    if (planId) {
      // Using Razorpay Subscriptions (recommended for recurring payments)
      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: 12, // 12 months
        notes: {
          userId: user.id,
          email: user.email || '',
          name: user.name || '',
        },
      })

      // Update user with currency and country
      await db.user.update({
        where: { id: user.id },
        data: {
          currency,
          country,
        },
      })

      return NextResponse.json({
        subscriptionId: subscription.id,
        currency,
        amount: currency === 'INR' ? amount : amount / 100, // Convert cents to dollars for display
        keyId: process.env.RAZORPAY_KEY_ID,
      })
    } else {
      // Fallback: One-time payment (if plans aren't configured yet)
      // This creates a simple order for one month
      const order = await razorpay.orders.create({
        amount: currency === 'INR' ? amount * 100 : amount, // Amount in paise (INR) or cents (USD)
        currency,
        receipt: `order_${user.id}_${Date.now()}`,
        notes: {
          userId: user.id,
          email: user.email || '',
          name: user.name || '',
          plan: 'pro',
        },
      })

      // Update user with currency and country
      await db.user.update({
        where: { id: user.id },
        data: {
          currency,
          country,
        },
      })

      return NextResponse.json({
        orderId: order.id,
        currency,
        amount: currency === 'INR' ? amount : amount / 100, // Convert cents to dollars for display
        keyId: process.env.RAZORPAY_KEY_ID,
      })
    }
  } catch (error: any) {
    console.error('Razorpay checkout error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to create checkout session. Please check Razorpay configuration.',
      },
      { status: 500 }
    )
  }
}
