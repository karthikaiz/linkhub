import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getUserSubscriptionPlan } from '@/lib/razorpay'
import { z } from 'zod'

const linkSchema = z.object({
  title: z.string().min(1).max(100),
  url: z.string().url(),
  order: z.number().optional(),
  type: z.enum(['link', 'youtube', 'spotify', 'tiktok']).optional(),
  embedUrl: z.string().nullable().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const links = await db.link.findMany({
      where: { userId: session.user.id },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(links)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = linkSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    // Check link limit
    const plan = await getUserSubscriptionPlan(session.user.id)
    const currentLinkCount = await db.link.count({
      where: { userId: session.user.id },
    })

    if (currentLinkCount >= plan.limits.links) {
      return NextResponse.json(
        { error: 'Link limit reached. Upgrade to Pro for unlimited links.' },
        { status: 403 }
      )
    }

    const { title, url, order, type, embedUrl } = validation.data

    const link = await db.link.create({
      data: {
        userId: session.user.id,
        title,
        url,
        order: order ?? currentLinkCount,
        type: type || 'link',
        embedUrl: embedUrl || null,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('Create link error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
