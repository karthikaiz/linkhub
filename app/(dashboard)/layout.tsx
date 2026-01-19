import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/sidebar'
import { db } from '@/lib/db'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, username: true, image: true },
  })

  return (
    <div className="min-h-screen bg-[#f9f9f7] overflow-x-hidden">
      <Sidebar user={user || session.user} />
      <main className="lg:pl-72 pt-16 lg:pt-0 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
