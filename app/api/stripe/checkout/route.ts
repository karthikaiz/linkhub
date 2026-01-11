import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { absoluteUrl } from '@/lib/utils'

export async function POST() {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRO_PRICE_ID) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set up STRIPE_SECRET_KEY and STRIPE_PRO_PRICE_ID in your environment variables.' },
        { status: 503 }
      )
    }

    const { stripe } = await import('@/lib/stripe')

    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        email: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const billingUrl = absoluteUrl('/settings')

    // If user already has a subscription, redirect to billing portal
    if (user.stripeSubscriptionId && user.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: billingUrl,
      })

      return NextResponse.json({ url: stripeSession.url })
    }

    // Create new checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl + '?success=true',
      cancel_url: billingUrl + '?canceled=true',
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.email!,
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please check Stripe configuration.' },
      { status: 500 }
    )
  }
}
