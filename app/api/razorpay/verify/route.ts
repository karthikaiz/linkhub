import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    } = body

    // Verify payment signature
    const secret = process.env.RAZORPAY_KEY_SECRET!

    let isValid = false

    if (razorpay_subscription_id) {
      // Verify subscription signature
      const text = `${razorpay_payment_id}|${razorpay_subscription_id}`
      const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(text)
        .digest('hex')
      isValid = generated_signature === razorpay_signature
    } else {
      // Verify order signature
      const text = `${razorpay_order_id}|${razorpay_payment_id}`
      const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(text)
        .digest('hex')
      isValid = generated_signature === razorpay_signature
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Get user's currency
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { currency: true },
    })

    const currency = user?.currency || 'INR'

    // Calculate subscription end date (1 month from now)
    const subscriptionEndDate = new Date()
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1)

    // Update user with subscription details
    await db.user.update({
      where: { id: session.user.id },
      data: {
        razorpayCustomerId: razorpay_payment_id, // Store payment ID as reference
        razorpaySubscriptionId: razorpay_subscription_id || razorpay_order_id,
        razorpayPlanId: `pro_${currency}`,
        subscriptionEndDate,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
