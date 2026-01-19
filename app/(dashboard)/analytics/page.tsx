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
      color: 'text-[#7c9885] bg-[#7c9885]/10',
    },
    {
      title: 'Total Link Clicks',
      value: formatNumber(totalClicks._sum.clicks || 0),
      icon: MousePointer,
      color: 'text-[#c77b58] bg-[#c77b58]/10',
    },
    {
      title: 'Views (30 days)',
      value: formatNumber(recentPageViews),
      icon: Eye,
      color: 'text-[#2d3029] bg-[#2d3029]/10',
    },
    {
      title: 'Clicks (30 days)',
      value: formatNumber(recentClicks),
      icon: MousePointer,
      color: 'text-[#6b8872] bg-[#6b8872]/10',
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
    <div className="space-y-8 animate-fade-in overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3029]">Analytics</h1>
        <p className="text-[#6b6b66] mt-1">Track your page performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-[#e8e4de] bg-white">
              <CardContent className="flex items-center gap-2 sm:gap-4 p-3 sm:p-6">
                <div className={`p-2 sm:p-3 rounded-xl ${stat.color} shrink-0`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-[#6b6b66] truncate">{stat.title}</p>
                  <p className="text-lg sm:text-2xl font-bold text-[#2d3029]">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 overflow-hidden">
        {/* Top Links */}
        <Card className="border-[#e8e4de] bg-white overflow-hidden">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg text-[#2d3029]">Top Performing Links</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            {topLinks.length === 0 ? (
              <p className="text-[#6b6b66] text-center py-8 text-sm">
                No link data yet. Share your page to start seeing analytics!
              </p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {topLinks.map((link, index) => (
                  <div key={link.id} className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xl sm:text-2xl font-bold text-[#e8e4de] w-6 sm:w-8 shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm sm:text-base text-[#2d3029]">{link.title}</p>
                      <p className="text-xs sm:text-sm text-[#6b6b66] truncate">{link.url}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm font-medium shrink-0 text-[#5c5c57]">
                      <MousePointer className="w-3 h-3 sm:w-4 sm:h-4 text-[#a8a8a3]" />
                      {formatNumber(link.clicks)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="border-[#e8e4de] bg-white overflow-hidden">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg text-[#2d3029]">Devices (Last 30 days)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            {deviceStats.length === 0 ? (
              <p className="text-[#6b6b66] text-center py-8 text-sm">
                No device data yet.
              </p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {deviceStats.map((device) => {
                  const Icon = deviceIcons[device.device || 'desktop'] || Globe
                  const percentage = Math.round(
                    (device._count.id / totalDeviceViews) * 100
                  )
                  return (
                    <div key={device.device} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-[#2d3029]">
                          <Icon className="w-4 h-4 text-[#6b6b66]" />
                          <span className="capitalize">
                            {device.device || 'Unknown'}
                          </span>
                        </div>
                        <span className="text-[#6b6b66]">
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#f5f2ed] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#7c9885] rounded-full"
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
        <Card className="md:col-span-2 border-[#e8e4de] bg-white overflow-hidden">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg text-[#2d3029]">Browsers (Last 30 days)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            {browserStats.length === 0 ? (
              <p className="text-[#6b6b66] text-center py-8 text-sm">
                No browser data yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {browserStats.map((browser) => {
                  const percentage = Math.round(
                    (browser._count.id / totalBrowserViews) * 100
                  )
                  return (
                    <div
                      key={browser.browser}
                      className="p-3 sm:p-4 bg-[#f9f9f7] rounded-xl border border-[#e8e4de]"
                    >
                      <p className="font-medium text-sm sm:text-base truncate text-[#2d3029]">{browser.browser || 'Unknown'}</p>
                      <p className="text-xl sm:text-2xl font-bold text-[#7c9885]">{percentage}%</p>
                      <p className="text-xs sm:text-sm text-[#6b6b66]">
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
