import Razorpay from 'razorpay'

// Only initialize Razorpay if the keys are available
export const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : (null as unknown as Razorpay)

// Plan pricing in different currencies
export const PLAN_PRICES = {
  INR: {
    pro: 299, // ₹299
  },
  USD: {
    pro: 499, // $4.99 (stored as cents)
  },
}

// Razorpay plan IDs (you'll create these in Razorpay dashboard)
export const RAZORPAY_PLANS = {
  INR: {
    pro: process.env.RAZORPAY_PLAN_ID_INR, // e.g., plan_xxxINRxxx
  },
  USD: {
    pro: process.env.RAZORPAY_PLAN_ID_USD, // e.g., plan_xxxUSDxxx
  },
}

export const PLANS = {
  free: {
    name: 'Free',
    description: 'For personal use',
    price: {
      INR: 0,
      USD: 0,
    },
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
    price: {
      INR: 299, // ₹299
      USD: 4.99, // $4.99
    },
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
      razorpaySubscriptionId: true,
      subscriptionEndDate: true,
      razorpayCustomerId: true,
      razorpayPlanId: true,
      currency: true,
      country: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const isPro =
    user.razorpayPlanId &&
    user.subscriptionEndDate &&
    user.subscriptionEndDate.getTime() > Date.now()

  const currency = (user.currency || 'INR') as 'INR' | 'USD'

  return {
    ...PLANS[isPro ? 'pro' : 'free'],
    razorpaySubscriptionId: user.razorpaySubscriptionId,
    subscriptionEndDate: user.subscriptionEndDate,
    razorpayCustomerId: user.razorpayCustomerId,
    currency,
    country: user.country,
    isPro,
  }
}

export function formatCurrency(amount: number, currency: 'INR' | 'USD') {
  if (currency === 'INR') {
    return `₹${amount}`
  }
  return `$${amount}`
}
