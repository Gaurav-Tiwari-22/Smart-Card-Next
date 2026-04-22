'use client'

import { useState, useEffect, useCallback } from 'react'
import { User } from '@/types'

interface ScanEntry {
  type: string
  timestamp: string
  device: string
  browser: string
  os: string
  ip: string
}

interface AnalyticsData {
  contactScans: number
  portfolioScans: number
  total: number
  byDay: Record<string, { contact: number; portfolio: number }>
  scanLog: ScanEntry[]
  memberSince: string
}

interface AnalyticsPageProps {
  user: User
  token: string
}

export function AnalyticsPage({ user, token }: AnalyticsPageProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/card/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (e) {
      console.error('Analytics fetch error:', e)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchAnalytics() }, [fetchAnalytics])

  const c     = data?.contactScans ?? user.contactScans ?? 0
  const p     = data?.portfolioScans ?? user.portfolioScans ?? 0
  const total = c + p

  // Build chart data from real byDay data (last 7 days)
  const today = new Date()
  const days7: { label: string; date: string; contact: number; portfolio: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().split('T')[0]
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
    const byDay = data?.byDay || {}
    days7.push({
      label: dayName,
      date: iso,
      contact: byDay[iso]?.contact || 0,
      portfolio: byDay[iso]?.portfolio || 0,
    })
  }
  const maxV = Math.max(...days7.map(d => Math.max(d.contact, d.portfolio)), 1)

  const card: React.CSSProperties = { background: 'var(--bg2)', border: '0.5px solid var(--brd)', borderRadius: 11, padding: 16 }

  // Time ago helper
  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const dys = Math.floor(hrs / 24)
    if (dys < 7) return `${dys}d ago`
    return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  // Device icon
  const deviceIcon = (device: string) => {
    if (device === 'Mobile') return '📱'
    if (device === 'Tablet') return '📱'
    return '💻'
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, color: 'var(--mt)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, marginBottom: 8, animation: 'pulse 1.5s infinite' }}>📊</div>
          <div style={{ fontSize: 13 }}>Loading analytics...</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Contact Scans',  value: c,    color: 'var(--gold)', sub: 'Contacts saved',  icon: '📇' },
          { label: 'Portfolio Views', value: p,    color: 'var(--blue)', sub: 'Portfolio opens',  icon: '🔗' },
          { label: 'Total Scans',    value: total, color: 'var(--tx)',   sub: 'All time',         icon: '📊' },
          { label: 'Conversion',     value: null,  color: 'var(--grn)',  sub: 'Portfolio / total', icon: '📈', pct: total ? Math.round((p / total) * 100) : 0 },
        ].map((st, i) => (
          <div key={i} style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>{st.icon}</span>
              <span style={{ fontSize: 11, color: 'var(--mt)' }}>{st.label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: st.color, lineHeight: 1 }}>
              {st.value !== null ? st.value : `${st.pct}%`}
            </div>
            <div style={{ fontSize: 10, color: 'var(--mt2)', marginTop: 4 }}>{st.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Real bar chart */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Scans — Last 7 Days</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            {[['var(--gold)', 'Contact'], ['var(--blue)', 'Portfolio']].map(([clr, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: clr }} />
                <span style={{ fontSize: 10, color: 'var(--mt)' }}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 100 }}>
            {days7.map((d) => (
              <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 2, width: '100%' }}>
                  <div style={{ flex: 1, height: Math.max(Math.round((d.contact / maxV) * 80), d.contact > 0 ? 6 : 2), background: 'var(--gold)', borderRadius: '3px 3px 0 0', minHeight: 2, transition: 'height .5s' }} />
                  <div style={{ flex: 1, height: Math.max(Math.round((d.portfolio / maxV) * 80), d.portfolio > 0 ? 6 : 2), background: 'var(--blue)', borderRadius: '3px 3px 0 0', minHeight: 2, transition: 'height .5s' }} />
                </div>
                <div style={{ fontSize: 8, color: 'var(--mt)', fontFamily: "'DM Mono',monospace" }}>{d.label}</div>
              </div>
            ))}
          </div>
          {total === 0 && (
            <div style={{ textAlign: 'center', marginTop: 12, padding: '10px', background: 'var(--bg3)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--mt)' }}>No scans yet — share your QR to get started!</div>
            </div>
          )}
        </div>

        {/* Breakdown + tips */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Scan Breakdown</div>
          {[
            { label: 'Contact QR', val: c, color: 'var(--gold)' },
            { label: 'Portfolio QR', val: p, color: 'var(--blue)' },
          ].map(row => (
            <div key={row.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12 }}>{row.label}</span>
                <span style={{ fontSize: 12, color: row.color, fontWeight: 600 }}>{row.val}</span>
              </div>
              <div style={{ background: 'var(--bg3)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${total ? Math.round(row.val / total * 100) : 0}%`, background: row.color, borderRadius: 4, transition: 'width .8s' }} />
              </div>
            </div>
          ))}
          <div style={{ height: '0.5px', background: 'var(--brd)', margin: '12px 0' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--tx)' }}>{total}</div>
            <div style={{ fontSize: 11, color: 'var(--mt)' }}>Total Scans</div>
          </div>
        </div>
      </div>

      {/* Scan History Table */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Scan History — Recent Activity</div>
          <button
            onClick={fetchAnalytics}
            style={{ padding: '4px 10px', background: 'transparent', border: '0.5px solid var(--brd2)', borderRadius: 6, color: 'var(--tx)', fontSize: 11, cursor: 'pointer' }}
          >⟳ Refresh</button>
        </div>

        {(data?.scanLog && data.scanLog.length > 0) ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--brd)' }}>
                  {['#', 'Type', 'Device', 'Browser', 'OS', 'IP', 'Time'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 10, color: 'var(--mt)', fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', fontFamily: "'DM Mono',monospace", whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.scanLog.map((scan, i) => (
                  <tr key={i} style={{ borderBottom: '0.5px solid var(--brd)', transition: 'background .15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '8px 10px', color: 'var(--mt2)', fontFamily: "'DM Mono',monospace" }}>{i + 1}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600,
                        background: scan.type === 'contact' ? 'rgba(201,168,76,.15)' : 'rgba(59,130,246,.15)',
                        color: scan.type === 'contact' ? 'var(--gold)' : 'var(--blue)',
                        border: `0.5px solid ${scan.type === 'contact' ? 'rgba(201,168,76,.3)' : 'rgba(59,130,246,.3)'}`,
                      }}>
                        {scan.type === 'contact' ? '📇 Contact' : '🔗 Portfolio'}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>
                      <span style={{ marginRight: 4 }}>{deviceIcon(scan.device)}</span>
                      <span style={{ color: 'var(--tx)' }}>{scan.device}</span>
                    </td>
                    <td style={{ padding: '8px 10px', color: 'var(--tx)' }}>{scan.browser}</td>
                    <td style={{ padding: '8px 10px', color: 'var(--mt)' }}>{scan.os}</td>
                    <td style={{ padding: '8px 10px', fontFamily: "'DM Mono',monospace", color: 'var(--mt2)', fontSize: 10 }}>{scan.ip || '—'}</td>
                    <td style={{ padding: '8px 10px', color: 'var(--mt)', whiteSpace: 'nowrap', fontFamily: "'DM Mono',monospace", fontSize: 10 }}>{timeAgo(scan.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 20px' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
            <div style={{ fontSize: 13, color: 'var(--mt)', marginBottom: 4 }}>No scans recorded yet</div>
            <div style={{ fontSize: 11, color: 'var(--mt2)', lineHeight: 1.6 }}>
              Jab koi aapka QR scan karega — contact ya portfolio —<br />
              uska device, browser, OS, IP, aur time yahan automatically dikhega.
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div style={{ ...card, marginTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>💡 Get More Scans</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
          {[
            'Add "Scan to save" call-to-action text below the QR on your card',
            'Use matte PVC material for premium look and feel',
            'Always carry 10+ cards to networking events and meetups',
            'Put the contact QR in your email signature too',
            'Add the portfolio QR to your LinkedIn featured section',
            'Share your card QR as WhatsApp status for easy access',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px', background: 'var(--bg3)', borderRadius: 7, border: '0.5px solid var(--brd)' }}>
              <span style={{ color: 'var(--gold)', fontSize: 11, flexShrink: 0 }}>→</span>
              <span style={{ fontSize: 11, color: 'var(--mt)', lineHeight: 1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
