import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { LinksManager } from '@/components/dashboard/links-manager'
import { getUserSubscriptionPlan } from '@/lib/stripe'

export default async function LinksPage() {
  const session = await getServerSession(authOptions)

  const links = await db.link.findMany({
    where: { userId: session!.user.id },
    orderBy: { order: 'asc' },
  })

  const plan = await getUserSubscriptionPlan(session!.user.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Links</h1>
        <p className="text-gray-600">Manage your links and their order</p>
      </div>

      <LinksManager
        initialLinks={links}
        maxLinks={plan.limits.links}
        isPro={plan.isPro || false}
      />
    </div>
  )
}
