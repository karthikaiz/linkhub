import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatNumber } from '@/lib/utils'
import { Eye, MousePointer, Globe, Smartphone, Monitor, Tablet } from 'lucide-react'

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)

  // Get date range (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    totalPageViews,
    totalClicks,
    recentPageViews,
    recentClicks,
    topLinks,
    deviceStats,
    browserStats,
  ] = await Promise.all([
    // All time page views
    db.analytics.count({
      where: { userId: session!.user.id, type: 'page_view' },
    }),
    // All time clicks
    db.link.aggregate({
      where: { userId: session!.user.id },
      _sum: { clicks: true },
    }),
    // Last 30 days page views
    db.analytics.count({
      where: {
        userId: session!.user.id,
        type: 'page_view',
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    // Last 30 days clicks
    db.analytics.count({
      where: {
        userId: session!.user.id,
        type: 'link_click',
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    // Top links
    db.link.findMany({
      where: { userId: session!.user.id },
      orderBy: { clicks: 'desc' },
      take: 5,
    }),
    // Device breakdown
    db.analytics.groupBy({
      by: ['device'],
      where: {
        userId: session!.user.id,
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: { id: true },
    }),
    // Browser breakdown
    db.analytics.groupBy({
      by: ['browser'],
      where: {
        userId: session!.user.id,
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: { id: true },
    }),
  ])

  const stats = [
    {
      title: 'Total Page Views',
      value: formatNumber(totalPageViews),
      icon: Eye,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Total Link Clicks',
      value: formatNumber(totalClicks._sum.clicks || 0),
      icon: MousePointer,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Views (30 days)',
      value: formatNumber(recentPageViews),
      icon: Eye,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Clicks (30 days)',
      value: formatNumber(recentClicks),
      icon: MousePointer,
      color: 'text-orange-600 bg-orange-100',
    },
  ]

  const deviceIcons: Record<string, any> = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor,
  }

  const totalDeviceViews = deviceStats.reduce((acc, d) => acc + d._count.id, 0)
  const totalBrowserViews = browserStats.reduce((acc, b) => acc + b._count.id, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-600">Track your page performance</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-5 h-5" />
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

      <div className="grid gap-8 md:grid-cols-2">
        {/* Top Links */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Links</CardTitle>
          </CardHeader>
          <CardContent>
            {topLinks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No link data yet. Share your page to start seeing analytics!
              </p>
            ) : (
              <div className="space-y-4">
                {topLinks.map((link, index) => (
                  <div key={link.id} className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-300 w-8">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{link.title}</p>
                      <p className="text-sm text-gray-500 truncate">{link.url}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <MousePointer className="w-4 h-4 text-gray-400" />
                      {formatNumber(link.clicks)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Devices (Last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {deviceStats.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No device data yet.
              </p>
            ) : (
              <div className="space-y-4">
                {deviceStats.map((device) => {
                  const Icon = deviceIcons[device.device || 'desktop'] || Globe
                  const percentage = Math.round(
                    (device._count.id / totalDeviceViews) * 100
                  )
                  return (
                    <div key={device.device} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span className="capitalize">
                            {device.device || 'Unknown'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Browser Breakdown */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Browsers (Last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {browserStats.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No browser data yet.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {browserStats.map((browser) => {
                  const percentage = Math.round(
                    (browser._count.id / totalBrowserViews) * 100
                  )
                  return (
                    <div
                      key={browser.browser}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <p className="font-medium">{browser.browser || 'Unknown'}</p>
                      <p className="text-2xl font-bold">{percentage}%</p>
                      <p className="text-sm text-gray-500">
                        {browser._count.id} visits
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
