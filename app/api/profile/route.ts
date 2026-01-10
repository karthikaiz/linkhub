import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().optional(),
  bio: z.string().optional(),
  backgroundColor: z.string().optional(),
  buttonStyle: z.string().optional(),
  buttonColor: z.string().optional(),
  textColor: z.string().optional(),
  fontFamily: z.string().optional(),
  theme: z.string().optional(),
})

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = updateSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { title, bio, ...profileData } = validation.data

    // Update user info
    if (title !== undefined || bio !== undefined) {
      await db.user.update({
        where: { id: session.user.id },
        data: {
          name: title,
          bio,
        },
      })
    }

    // Update profile settings
    const profile = await db.profile.update({
      where: { userId: session.user.id },
      data: profileData,
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
