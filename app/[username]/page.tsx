import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { headers } from 'next/headers'
import { PublicProfile } from '@/components/profile/public-profile'

interface PageProps {
  params: { username: string }
}

export async function generateMetadata({ params }: PageProps) {
  const user = await db.user.findUnique({
    where: { username: params.username },
    select: { name: true, bio: true, username: true },
  })

  if (!user) {
    return { title: 'User not found | LinkHub' }
  }

  return {
    title: `${user.name || user.username} | LinkHub`,
    description: user.bio || `Check out ${user.name || user.username}'s links`,
  }
}

export default async function UserProfilePage({ params }: PageProps) {
  const user = await db.user.findUnique({
    where: { username: params.username },
    include: {
      profile: true,
      links: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!user) {
    notFound()
  }

  // Track page view
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const referer = headersList.get('referer') || ''

  // Simple device detection
  const device = /mobile/i.test(userAgent)
    ? 'mobile'
    : /tablet/i.test(userAgent)
    ? 'tablet'
    : 'desktop'

  // Simple browser detection
  const browser = /chrome/i.test(userAgent)
    ? 'Chrome'
    : /firefox/i.test(userAgent)
    ? 'Firefox'
    : /safari/i.test(userAgent)
    ? 'Safari'
    : /edge/i.test(userAgent)
    ? 'Edge'
    : 'Other'

  // Create analytics record
  await db.analytics.create({
    data: {
      userId: user.id,
      type: 'page_view',
      device,
      browser,
      referer: referer || null,
    },
  })

  return (
    <PublicProfile
      user={{
        id: user.id,
        name: user.name,
        username: user.username!,
        bio: user.bio,
        image: user.image,
      }}
      profile={user.profile!}
      links={user.links}
    />
  )
}
