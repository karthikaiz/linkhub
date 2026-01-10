import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Total Clicks',
      value: formatNumber(totalClicks._sum.clicks || 0),
      icon: MousePointer,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Page Views',
      value: formatNumber(pageViews),
      icon: Eye,
      color: 'text-purple-600 bg-purple-100',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {session?.user.name}!</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/links">
            <Button>
              <LinkIcon className="w-4 h-4 mr-2" />
              Add New Link
            </Button>
          </Link>
          <Link href="/appearance">
            <Button variant="outline">Customize Appearance</Button>
          </Link>
          <Link href="/analytics">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </Link>
          {session?.user.username && (
            <Link href={`/${session.user.username}`} target="_blank">
              <Button variant="secondary">View Your Page</Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Recent Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Links</CardTitle>
          <Link href="/links">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentLinks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No links yet. Add your first link to get started!</p>
              <Link href="/links">
                <Button className="mt-4">Add Your First Link</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{link.title}</p>
                    <p className="text-sm text-gray-500 truncate">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
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
        <Card className="bg-gradient-to-r from-primary-500 to-purple-500 text-white">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2">Share Your LinkHub</h3>
            <p className="mb-4 opacity-90">
              Your unique link is ready to share with the world!
            </p>
            <div className="bg-white/20 backdrop-blur rounded-lg p-3 flex items-center justify-between">
              <span className="font-mono">
                {process.env.NEXT_PUBLIC_APP_URL}/{session.user.username}
              </span>
              <Button
                size="sm"
                className="bg-white text-primary-600 hover:bg-gray-100"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_APP_URL}/${session.user.username}`
                  )
                }}
              >
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
