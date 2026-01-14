import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const subscribeSchema = z.object({
  userId: z.string(),
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = subscribeSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { userId, email, name } = validation.data

    // Check if user exists and has email capture enabled
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.profile?.emailCaptureEnabled) {
      return NextResponse.json({ error: 'Email capture not enabled' }, { status: 400 })
    }

    // Create or update subscriber
    const subscriber = await db.emailSubscriber.upsert({
      where: {
        userId_email: {
          userId,
          email,
        },
      },
      update: {
        name: name || undefined,
      },
      create: {
        userId,
        email,
        name,
      },
    })

    return NextResponse.json({ success: true, subscriber })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
