import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get('x-razorpay-signature') as string

    // Verify webhook signature
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.error('Webhook signature verification failed')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)
    const eventType = event.event

    console.log('Razorpay webhook event:', eventType)

    // Handle different webhook events
    switch (eventType) {
      case 'subscription.activated':
      case 'subscription.charged': {
        // Subscription payment successful
        const subscription = event.payload.subscription.entity
        const payment = event.payload.payment.entity

        // Find user by subscription ID or payment notes
        const user = await db.user.findFirst({
          where: {
            OR: [
              { razorpaySubscriptionId: subscription.id },
              {
                id: subscription.notes?.userId || payment.notes?.userId,
              },
            ],
          },
        })

        if (user) {
          // Calculate next billing date
          const subscriptionEndDate = new Date(subscription.current_end * 1000)

          await db.user.update({
            where: { id: user.id },
            data: {
              razorpaySubscriptionId: subscription.id,
              razorpayCustomerId: subscription.customer_id,
              razorpayPlanId: subscription.plan_id,
              subscriptionEndDate,
            },
          })

          console.log(`Subscription activated for user ${user.id}`)
        }
        break
      }

      case 'subscription.cancelled':
      case 'subscription.expired': {
        // Subscription cancelled or expired
        const subscription = event.payload.subscription.entity

        const user = await db.user.findFirst({
          where: { razorpaySubscriptionId: subscription.id },
        })

        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: {
              razorpayPlanId: null,
              subscriptionEndDate: null,
            },
          })

          console.log(`Subscription cancelled for user ${user.id}`)
        }
        break
      }

      case 'subscription.paused':
      case 'subscription.halted': {
        // Subscription paused or payment failed
        const subscription = event.payload.subscription.entity

        const user = await db.user.findFirst({
          where: { razorpaySubscriptionId: subscription.id },
        })

        if (user) {
          // Keep the subscription but mark it as expired
          await db.user.update({
            where: { id: user.id },
            data: {
              subscriptionEndDate: new Date(), // Expire immediately
            },
          })

          console.log(`Subscription paused/halted for user ${user.id}`)
        }
        break
      }

      case 'payment.captured': {
        // One-time payment captured (for non-subscription payments)
        const payment = event.payload.payment.entity

        // If this is a one-time Pro plan payment (not subscription)
        if (payment.notes?.userId && payment.notes?.plan === 'pro') {
          const subscriptionEndDate = new Date()
          subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1)

          await db.user.update({
            where: { id: payment.notes.userId },
            data: {
              razorpayCustomerId: payment.id,
              razorpayPlanId: `pro_${payment.currency}`,
              subscriptionEndDate,
            },
          })

          console.log(`One-time payment captured for user ${payment.notes.userId}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
