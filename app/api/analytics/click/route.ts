import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { linkId, userId } = await request.json()

    if (!linkId || !userId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

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

    // Create analytics record and increment click count
    await Promise.all([
      db.analytics.create({
        data: {
          userId,
          linkId,
          type: 'link_click',
          device,
          browser,
          referer: referer || null,
        },
      }),
      db.link.update({
        where: { id: linkId },
        data: { clicks: { increment: 1 } },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
