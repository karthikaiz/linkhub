import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

// Reserved usernames that cannot be used
const RESERVED_USERNAMES = [
  'admin', 'api', 'app', 'dashboard', 'settings', 'login', 'register',
  'logout', 'profile', 'links', 'analytics', 'appearance', 'help',
  'support', 'about', 'contact', 'terms', 'privacy', 'blog', 'docs',
  'linkhub', 'pro', 'premium', 'upgrade', 'pricing', 'home', 'index',
]

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-z0-9_-]+$/, 'Only lowercase letters, numbers, underscores, and hyphens allowed')
    .refine((val) => !RESERVED_USERNAMES.includes(val), 'This username is reserved'),
})

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = usernameSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { username } = validation.data

    // Check if username is already taken by another user
    const existingUser = await db.user.findUnique({
      where: { username },
      select: { id: true },
    })

    if (existingUser && existingUser.id !== session.user.id) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      )
    }

    // Update the username
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { username },
      select: { username: true },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Update username error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
