import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
  type: z.enum(['link', 'youtube', 'spotify', 'tiktok']).optional(),
  embedUrl: z.string().nullable().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const link = await db.link.findUnique({
      where: { id: params.id },
    })

    if (!link || link.userId !== session.user.id) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    const body = await request.json()
    const validation = updateSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const updatedLink = await db.link.update({
      where: { id: params.id },
      data: validation.data,
    })

    return NextResponse.json(updatedLink)
  } catch (error) {
    console.error('Update link error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const link = await db.link.findUnique({
      where: { id: params.id },
    })

    if (!link || link.userId !== session.user.id) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    await db.link.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete link error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
