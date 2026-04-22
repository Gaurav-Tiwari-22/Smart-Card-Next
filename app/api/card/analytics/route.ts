import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import UserModel from '@/models/User'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await UserModel.findById(user._id)
      .select('contactScans portfolioScans scanHistory createdAt')

    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recent = data.scanHistory.filter(
      (s: { timestamp: Date }) => s.timestamp >= thirtyDaysAgo
    )

    // Group by day for chart
    const byDay: Record<string, { contact: number; portfolio: number }> = {}
    recent.forEach((scan: { timestamp: Date; type: string }) => {
      const day = scan.timestamp.toISOString().split('T')[0]
      if (!byDay[day]) byDay[day] = { contact: 0, portfolio: 0 }
      if (scan.type === 'contact' || scan.type === 'portfolio') {
        byDay[day][scan.type as 'contact' | 'portfolio']++
      }
    })

    // Return last 50 scan history entries (newest first) with full device info
    const scanLog = data.scanHistory
      .sort((a: { timestamp: Date }, b: { timestamp: Date }) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 50)
      .map((s: { type: string; timestamp: Date; device: string; browser: string; os: string; ip: string }) => ({
        type: s.type,
        timestamp: s.timestamp,
        device: s.device || 'Unknown',
        browser: s.browser || 'Unknown',
        os: s.os || 'Unknown',
        ip: s.ip || '',
      }))

    return NextResponse.json({
      contactScans:   data.contactScans,
      portfolioScans: data.portfolioScans,
      total:          data.contactScans + data.portfolioScans,
      byDay,
      scanLog,
      memberSince:    data.createdAt,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
