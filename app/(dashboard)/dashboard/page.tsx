import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import Link from 'next/link'
import { BarChart3, Link as LinkIcon, Eye, MousePointer } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const [linksCount, totalClicks, pageViews] = await Promise.all([
    db.link.count({
      where: { userId: session!.user.id },
    }),
    db.link.aggregate({
      where: { userId: session!.user.id },
      _sum: { clicks: true },
    }),
    db.analytics.count({
      where: {
        userId: session!.user.id,
        type: 'page_view',
      },
    }),
  ])

  const recentLinks = await db.link.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const stats = [
    {
      title: 'Total Links',
      value: formatNumber(linksCount),
      icon: LinkIcon,
      color: 'text-[#7c9885] bg-[#7c9885]/10',
    },
    {
      title: 'Total Clicks',
      value: formatNumber(totalClicks._sum.clicks || 0),
      icon: MousePointer,
      color: 'text-[#c77b58] bg-[#c77b58]/10',
    },
    {
      title: 'Page Views',
      value: formatNumber(pageViews),
      icon: Eye,
      color: 'text-[#2d3029] bg-[#2d3029]/10',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3029]">Dashboard</h1>
        <p className="text-[#6b6b66] mt-1">Welcome back, {session?.user.name}!</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-[#e8e4de] bg-white">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-[#6b6b66]">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#2d3029]">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-[#e8e4de] bg-white">
        <CardHeader>
          <CardTitle className="text-[#2d3029]">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/links">
            <Button className="bg-[#7c9885] hover:bg-[#6b8872] text-white rounded-xl">
              <LinkIcon className="w-4 h-4 mr-2" />
              Add New Link
            </Button>
          </Link>
          <Link href="/appearance">
            <Button variant="outline" className="rounded-xl border-[#e8e4de] text-[#2d3029] hover:bg-[#f5f2ed] hover:border-[#7c9885]">
              Customize Appearance
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="outline" className="rounded-xl border-[#e8e4de] text-[#2d3029] hover:bg-[#f5f2ed] hover:border-[#7c9885]">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </Link>
          {session?.user.username && (
            <Link href={`/${session.user.username}`} target="_blank">
              <Button variant="outline" className="rounded-xl border-[#e8e4de] text-[#2d3029] hover:bg-[#f5f2ed] hover:border-[#7c9885]">
                View Your Page
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Recent Links */}
      <Card className="border-[#e8e4de] bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#2d3029]">Recent Links</CardTitle>
          <Link href="/links">
            <Button variant="ghost" size="sm" className="text-[#7c9885] hover:text-[#6b8872] hover:bg-[#7c9885]/10">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentLinks.length === 0 ? (
            <div className="text-center py-8 text-[#6b6b66]">
              <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No links yet. Add your first link to get started!</p>
              <Link href="/links">
                <Button className="mt-4 bg-[#7c9885] hover:bg-[#6b8872] text-white rounded-xl">
                  Add Your First Link
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 bg-[#f9f9f7] rounded-xl border border-[#e8e4de]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-[#2d3029]">{link.title}</p>
                    <p className="text-sm text-[#6b6b66] truncate">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6b6b66]">
                    <MousePointer className="w-4 h-4" />
                    {link.clicks}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Link */}
      {session?.user.username && (
        <Card className="bg-[#2d3029] text-white border-0 shadow-xl">
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-bold text-lg mb-2">Share Your LinkHub</h3>
            <p className="mb-4 opacity-80 text-sm sm:text-base">
              Your unique link is ready to share with the world!
            </p>
            <div className="bg-white/10 rounded-xl p-3 flex items-center gap-2 border border-white/10">
              <span className="font-mono text-xs sm:text-sm flex-1 truncate overflow-hidden">
                {process.env.NEXT_PUBLIC_APP_URL}/{session.user.username}
              </span>
              <CopyButton text={`${process.env.NEXT_PUBLIC_APP_URL}/${session.user.username}`} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
