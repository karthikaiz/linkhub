import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PLANS = {
  free: {
    name: 'Free',
    description: 'For personal use',
    price: 0,
    features: [
      'Up to 5 links',
      'Basic analytics',
      'Standard themes',
      'LinkHub branding',
    ],
    limits: {
      links: 5,
    },
  },
  pro: {
    name: 'Pro',
    description: 'For creators and businesses',
    price: 5,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Unlimited links',
      'Advanced analytics',
      'Custom themes',
      'No branding',
      'Priority support',
      'Custom CSS',
    ],
    limits: {
      links: Infinity,
    },
  },
}

export async function getUserSubscriptionPlan(userId: string) {
  const { db } = await import('./db')

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const isPro =
    user.stripePriceId &&
    user.stripeCurrentPeriodEnd &&
    user.stripeCurrentPeriodEnd.getTime() > Date.now()

  return {
    ...PLANS[isPro ? 'pro' : 'free'],
    stripeSubscriptionId: user.stripeSubscriptionId,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
    stripeCustomerId: user.stripeCustomerId,
    isPro,
  }
}
