import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserSubscriptionPlan } from '@/lib/razorpay'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const plan = await getUserSubscriptionPlan(session.user.id)

    return NextResponse.json({
      isPro: plan.isPro,
      planName: plan.name,
      subscriptionEndDate: plan.subscriptionEndDate,
    })
  } catch (error: any) {
    console.error('Error checking subscription status:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    )
  }
}
