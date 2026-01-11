import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AppearanceEditor } from '@/components/dashboard/appearance-editor'
import { getUserSubscriptionPlan } from '@/lib/stripe'

export default async function AppearancePage() {
  const session = await getServerSession(authOptions)

  const [profile, links, plan] = await Promise.all([
    db.profile.findUnique({
      where: { userId: session!.user.id },
    }),
    db.link.findMany({
      where: { userId: session!.user.id, isActive: true },
      orderBy: { order: 'asc' },
    }),
    getUserSubscriptionPlan(session!.user.id),
  ])

  const user = await db.user.findUnique({
    where: { id: session!.user.id },
    select: { username: true, name: true, bio: true, image: true },
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appearance</h1>
        <p className="text-gray-500 mt-1">Customize how your page looks</p>
      </div>

      <AppearanceEditor
        profile={profile!}
        user={user!}
        links={links}
        isPro={plan.isPro || false}
      />
    </div>
  )
}
