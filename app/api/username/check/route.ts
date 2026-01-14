import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Reserved usernames that cannot be used
const RESERVED_USERNAMES = [
  'admin', 'api', 'app', 'dashboard', 'settings', 'login', 'register',
  'logout', 'profile', 'links', 'analytics', 'appearance', 'help',
  'support', 'about', 'contact', 'terms', 'privacy', 'blog', 'docs',
  'linkhub', 'pro', 'premium', 'upgrade', 'pricing', 'home', 'index',
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')?.toLowerCase()

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

    // Check if reserved
    if (RESERVED_USERNAMES.includes(username)) {
      return NextResponse.json({ available: false, reason: 'reserved' })
    }

    // Check if exists in database
    const existingUser = await db.user.findUnique({
      where: { username },
      select: { id: true },
    })

    return NextResponse.json({ available: !existingUser })
  } catch (error) {
    console.error('Username check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
