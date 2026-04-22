'use client'

import { User, CardDesign } from '@/types'
import { FONTS, TEMPLATES } from '@/lib/cardConstants'

interface CardFaceProps {
  user: Partial<User>
  design: Partial<CardDesign>
  side: 'front' | 'back'
  qrContactDataUrl?: string
  qrPortfolioDataUrl?: string
}

export function CardFace({ user, design, side, qrContactDataUrl, qrPortfolioDataUrl }: CardFaceProps) {
  const d        = design
  const tmpl     = TEMPLATES[(d.template as string) || 'executive']
  const style    = tmpl?.style || 'classic'
  const acc      = d.accentColor  || '#C9A84C'
  const tc       = d.textColor    || '#FFFFFF'
  const sc       = d.subtextColor || '#888884'
  const bg1      = d.bgColor      || '#0A0A0A'
  const bg2      = d.bgColor2     || '#1a1410'
  const ff       = FONTS[(d.fontFamily as keyof typeof FONTS) || 'playfair']?.css || "'Playfair Display',serif"
  const isCenter = d.frontLayout === 'name-center'
  const isLight  = tmpl?.category === 'light' || tmpl?.category === 'minimal' || tmpl?.category === 'professional'

  const qrPos: React.CSSProperties = (() => {
    switch (d.qrPosition) {
      case 'bottom-left': return { left: 16, bottom: 14 }
      case 'top-right':   return { right: 16, top: 14 }
      default:            return { right: 16, bottom: 14 }
    }
  })()

  // QR mini box
  const QRBox = ({ dataUrl, size = 52 }: { dataUrl?: string; size?: number }) => (
    <div style={{ background: '#fff', borderRadius: 5, padding: 3, width: size + 6, height: size + 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {dataUrl
        ? <img src={dataUrl} width={size} height={size} alt="QR" style={{ display: 'block' }} />
        : <div style={{ width: size, height: size, background: '#e5e5e5', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="1" stroke="#999" strokeWidth="1.5"/>
              <rect x="13" y="3" width="8" height="8" rx="1" stroke="#999" strokeWidth="1.5"/>
              <rect x="3" y="13" width="8" height="8" rx="1" stroke="#999" strokeWidth="1.5"/>
              <rect x="5" y="5" width="4" height="4" fill="#999" rx="0.5"/>
              <rect x="15" y="5" width="4" height="4" fill="#999" rx="0.5"/>
              <rect x="5" y="15" width="4" height="4" fill="#999" rx="0.5"/>
              <rect x="13" y="13" width="3" height="3" fill="#999" rx="0.5"/>
              <rect x="18" y="13" width="3" height="3" fill="#999" rx="0.5"/>
              <rect x="13" y="18" width="3" height="3" fill="#999" rx="0.5"/>
              <rect x="18" y="18" width="3" height="3" fill="#999" rx="0.5"/>
            </svg>
          </div>
      }
    </div>
  )

  // Contact item row for professional themes
  const ContactRow = ({ icon, value, color = sc }: { icon: string; value?: string; color?: string }) => {
    if (!value) return null
    return (
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 }}>
        <span style={{ fontSize: 9, color: acc, width: 12, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
        <span style={{ fontSize: 8, color, fontFamily: "'DM Mono',monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
      </div>
    )
  }

  if (side === 'front') {
    // ─── PROFESSIONAL THEMES ──────────────────────────────────────────
    if (style === 'professional') {
      const tKey = (d.template as string) || ''

      // ── AVIATO RED: White bg + red accent bar + wave separator ─────
      if (tKey === 'aviatored') {
        return (
          <div style={{ width: '100%', height: '100%', borderRadius: 13, overflow: 'hidden', position: 'relative', background: '#fff' }}>
            {/* Top accent line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: acc }} />
            {/* Main content */}
            <div style={{ padding: '18px 20px 0', height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Logo area */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: acc, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                  {(user.company || 'C')[0]}
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: tc, fontFamily: ff }}>{user.company || 'Company'}</div>
                  <div style={{ fontSize: 7, color: acc, letterSpacing: '.08em', textTransform: 'uppercase' }}>TECHNOLOGIES</div>
                </div>
              </div>
              {/* Contact details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
                <ContactRow icon="✆" value={user.phone} color={sc} />
                <ContactRow icon="✉" value={user.email} color={sc} />
                <ContactRow icon="◎" value={user.city || user.portfolioUrl} color={sc} />
              </div>
            </div>
            {/* Red wave bar at bottom */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 32 }}>
              <svg viewBox="0 0 400 40" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="none">
                <path d={`M0 15 Q100 0 200 15 T400 15 L400 40 L0 40 Z`} fill={acc} />
              </svg>
              <div style={{ position: 'absolute', bottom: 5, left: 20, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', fontFamily: ff }}>{user.name || 'Your Name'}</div>
                <div style={{ fontSize: 7, color: 'rgba(255,255,255,.85)' }}>{user.jobTitle || 'Job Position'}</div>
              </div>
            </div>
            {/* QR */}
            <div style={{ position: 'absolute', right: 14, bottom: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <QRBox dataUrl={qrContactDataUrl} size={42} />
            </div>
          </div>
        )
      }

      // ── CORPORATE BLUE: Navy sidebar + white main ──────────────────
      if (tKey === 'corpblue') {
        return (
          <div style={{ width: '100%', height: '100%', borderRadius: 13, overflow: 'hidden', position: 'relative', background: '#fff', display: 'flex' }}>
            {/* Blue sidebar */}
            <div style={{ width: '30%', background: `linear-gradient(180deg, ${acc}, #0D47A1)`, padding: '16px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                {(user.name || 'U')[0]}
              </div>
              <QRBox dataUrl={qrContactDataUrl} size={38} />
            </div>
            {/* Content */}
            <div style={{ flex: 1, padding: '18px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: ff, fontSize: 'clamp(13px,3vw,17px)', fontWeight: 700, color: tc }}>{user.name || 'Your Name'}</div>
                <div style={{ fontSize: 8, color: acc, letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 2, fontFamily: 'Outfit,sans-serif' }}>{user.jobTitle || 'Job Position'}</div>
                {d.showTagline && <div style={{ fontSize: 7, color: sc, fontStyle: 'italic', marginTop: 4, fontFamily: "'DM Mono',monospace" }}>{d.tagline}</div>}
                <div style={{ height: 1, background: `linear-gradient(90deg,${acc},transparent)`, margin: '8px 0', width: '70%' }} />
              </div>
              <div>
                <ContactRow icon="✆" value={user.phone} />
                <ContactRow icon="✉" value={user.email} />
                <ContactRow icon="◎" value={user.portfolioUrl || user.city} />
              </div>
            </div>
            {/* Diagonal accent stripe */}
            <div style={{ position: 'absolute', top: -10, right: -5, width: '35%', height: '120%', background: `${acc}08`, transform: 'rotate(-12deg)', pointerEvents: 'none' }} />
          </div>
        )
      }

      // ── MARBLE GOLD: Elegant marble + gold borders ─────────────────
      if (tKey === 'marblegold') {
        return (
          <div style={{ width: '100%', height: '100%', borderRadius: 13, overflow: 'hidden', position: 'relative', background: `linear-gradient(135deg,${bg1},${bg2})` }}>
            {/* Gold border frame */}
            <div style={{ position: 'absolute', inset: 6, border: `1px solid ${acc}55`, borderRadius: 8, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 9, border: `0.5px solid ${acc}30`, borderRadius: 6, pointerEvents: 'none' }} />
            {/* Marble texture overlay */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.03, background: `repeating-linear-gradient(45deg,${acc} 0, transparent 2px,transparent 8px)`, pointerEvents: 'none' }} />
            {/* Content */}
            <div style={{ padding: '22px 24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ fontFamily: ff, fontSize: 'clamp(15px,3.5vw,20px)', fontWeight: 600, color: tc, letterSpacing: '.06em', textAlign: 'center' }}>{user.name || 'Your Name'}</div>
              <div style={{ height: 1, width: 50, background: `linear-gradient(90deg,transparent,${acc},transparent)`, margin: '6px 0' }} />
              <div style={{ fontSize: 8, color: acc, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: 'Outfit,sans-serif' }}>{user.jobTitle || 'Job Position'}</div>
              {d.showTagline && <div style={{ fontSize: 7, color: sc, fontStyle: 'italic', marginTop: 8, fontFamily: "'DM Mono',monospace" }}>{d.tagline}</div>}
              <div style={{ marginTop: 12, display: 'flex', gap: 14, fontSize: 7, color: sc, fontFamily: "'DM Mono',monospace" }}>
                {user.phone && <span>✆ {user.phone}</span>}
                {user.email && <span>✉ {user.email}</span>}
              </div>
            </div>
            {/* QR */}
            <div style={{ position: 'absolute', right: 14, bottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <QRBox dataUrl={qrContactDataUrl} size={44} />
              <div style={{ fontSize: 6, color: acc, letterSpacing: '.08em', fontFamily: "'DM Mono',monospace" }}>SCAN</div>
            </div>
          </div>
        )
      }

      // ── HEXAGON TECH: Dark + hex pattern + cyan ────────────────────
      if (tKey === 'hextech') {
        return (
          <div style={{ width: '100%', height: '100%', borderRadius: 13, overflow: 'hidden', position: 'relative', background: `linear-gradient(135deg,${bg1},${bg2})` }}>
            {/* Hexagon pattern */}
            <svg style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', opacity: 0.08 }} viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
              {[0,1,2,3,4,5].map(row => [0,1,2].map(col => {
                const x = col * 60 + (row % 2 ? 30 : 0); const y = row * 35
                return <polygon key={`${row}-${col}`} points={`${x+15},${y} ${x+30},${y+8} ${x+30},${y+24} ${x+15},${y+32} ${x},${y+24} ${x},${y+8}`} fill="none" stroke={acc} strokeWidth="1" />
              })).flat()}
            </svg>
            {/* Left accent bar */}
            <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: `linear-gradient(to bottom,transparent,${acc},transparent)` }} />
            {/* Content */}
            <div style={{ padding: '20px 22px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <div>
                <div style={{ fontFamily: ff, fontSize: 'clamp(16px,3.5vw,22px)', fontWeight: 700, color: tc, letterSpacing: '.08em', textTransform: 'uppercase' }}>{user.name || 'Your Name'}</div>
                <div style={{ fontSize: 8, color: acc, letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 3, fontFamily: 'Outfit,sans-serif' }}>{user.jobTitle || 'Developer'}</div>
                {d.showTagline && <div style={{ fontSize: 7, color: sc, fontStyle: 'italic', marginTop: 6, fontFamily: "'DM Mono',monospace" }}>{d.tagline}</div>}
              </div>
              <div>
                <ContactRow icon="✆" value={user.phone} />
                <ContactRow icon="✉" value={user.email} />
                <ContactRow icon="◎" value={user.portfolioUrl} />
              </div>
            </div>
            {/* QR */}
            <div style={{ position: 'absolute', right: 14, bottom: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, zIndex: 2 }}>
              <QRBox dataUrl={qrContactDataUrl} size={48} />
              <div style={{ fontSize: 6, color: acc, letterSpacing: '.08em', fontFamily: "'DM Mono',monospace" }}>CONNECT</div>
            </div>
          </div>
        )
      }

      // ── BOTANICAL: White + leaf corners + green ────────────────────
      if (tKey === 'botanical') {
        return (
          <div style={{ width: '100%', height: '100%', borderRadius: 13, overflow: 'hidden', position: 'relative', background: `linear-gradient(150deg,${bg1},${bg2})` }}>
            {/* Top-left leaf decoration */}
            <svg style={{ position: 'absolute', top: -2, left: -2, width: 70, height: 70, opacity: 0.2 }} viewBox="0 0 100 100">
              <path d="M5 95 Q5 5 95 5 Q50 30 30 50 Q15 65 5 95 Z" fill={acc} />
              <path d="M8 90 Q15 20 85 10" fill="none" stroke={acc} strokeWidth="0.8" />
              <path d="M10 85 Q20 35 75 15" fill="none" stroke={acc} strokeWidth="0.5" />
            </svg>
            {/* Bottom-right leaf decoration */}
            <svg style={{ position: 'absolute', bottom: -2, right: -2, width: 70, height: 70, opacity: 0.2, transform: 'rotate(180deg)' }} viewBox="0 0 100 100">
              <path d="M5 95 Q5 5 95 5 Q50 30 30 50 Q15 65 5 95 Z" fill={acc} />
              <path d="M8 90 Q15 20 85 10" fill="none" stroke={acc} strokeWidth="0.8" />
            </svg>
            {/* Content */}
            <div style={{ padding: '22px 20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <div>
                <div style={{ fontFamily: ff, fontSize: 'clamp(14px,3.2vw,18px)', fontWeight: 600, color: tc, letterSpacing: '.02em' }}>{user.name || 'Your Name'}</div>
                <div style={{ fontSize: 8, color: acc, letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 3, fontFamily: 'Outfit,sans-serif' }}>{user.jobTitle || 'Job Position'}</div>
                <div style={{ height: 1, background: `linear-gradient(90deg,${acc}88,transparent)`, margin: '8px 0', width: '50%' }} />
              </div>
              <div>
                <ContactRow icon="✆" value={user.phone} />
                <ContactRow icon="✉" value={user.email} />
                <ContactRow icon="◎" value={user.portfolioUrl || user.city} />
              </div>
            </div>
            {/* QR */}
            <div style={{ position: 'absolute', right: 14, bottom: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, zIndex: 2 }}>
              <QRBox dataUrl={qrContactDataUrl} size={46} />
            </div>
          </div>
        )
      }

      // ── SUNSET WAVE: Wave separator + orange gradient ──────────────
      if (tKey === 'sunsetwave') {
        return (
          <div style={{ width: '100%', height: '100%', borderRadius: 13, overflow: 'hidden', position: 'relative', background: '#fff' }}>
            {/* Top section */}
            <div style={{ padding: '16px 20px 24px', position: 'relative' }}>
              <div style={{ fontFamily: ff, fontSize: 'clamp(14px,3vw,18px)', fontWeight: 700, color: tc }}>{user.name || 'Your Name'}</div>
              <div style={{ fontSize: 8, color: acc, letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 2, fontFamily: 'Outfit,sans-serif' }}>{user.jobTitle || 'Job Position'}</div>
              {d.showTagline && <div style={{ fontSize: 7, color: sc, fontStyle: 'italic', marginTop: 4, fontFamily: "'DM Mono',monospace" }}>{d.tagline}</div>}
            </div>
            {/* Wave separator */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: '48%' }}>
              <svg viewBox="0 0 400 30" style={{ width: '100%', display: 'block' }} preserveAspectRatio="none">
                <path d="M0 20 Q60 0 120 15 T240 10 T360 18 T400 12 L400 30 L0 30 Z" fill={`${acc}15`} />
                <path d="M0 22 Q80 5 160 18 T320 12 T400 20" fill="none" stroke={acc} strokeWidth="1.5" />
              </svg>
            </div>
            {/* Bottom section */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <ContactRow icon="✆" value={user.phone} />
                <ContactRow icon="✉" value={user.email} />
                <ContactRow icon="◎" value={user.portfolioUrl || user.city} />
              </div>
              <QRBox dataUrl={qrContactDataUrl} size={44} />
            </div>
            {/* Bottom accent */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${acc},#FF8F00,${acc})` }} />
          </div>
        )
      }

      // ── MINIMAL LINES: Clean white + line dividers ─────────────────
      if (tKey === 'minlines') {
        return (
          <div style={{ width: '100%', height: '100%', borderRadius: 13, overflow: 'hidden', position: 'relative', background: bg1 }}>
            {/* Subtle dot pattern */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: `radial-gradient(${acc} 1px, transparent 1px)`, backgroundSize: '12px 12px', pointerEvents: 'none' }} />
            {/* Content */}
            <div style={{ padding: '22px 24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 30, height: 1, background: acc, marginBottom: 10 }} />
              <div style={{ fontFamily: ff, fontSize: 'clamp(14px,3.2vw,18px)', fontWeight: 600, color: tc, textAlign: 'center', letterSpacing: '.04em' }}>{user.name || 'Your Name'}</div>
              <div style={{ fontSize: 8, color: sc, letterSpacing: '.18em', textTransform: 'uppercase', marginTop: 4, fontFamily: 'Outfit,sans-serif' }}>{user.jobTitle || 'Job Position'}</div>
              <div style={{ width: 30, height: 1, background: acc, marginTop: 10, marginBottom: 10 }} />
              <div style={{ display: 'flex', gap: 16, fontSize: 7, color: sc, fontFamily: "'DM Mono',monospace" }}>
                {user.phone && <span>{user.phone}</span>}
                {user.email && <span>{user.email}</span>}
              </div>
            </div>
            {/* QR bottom-right */}
            <div style={{ position: 'absolute', right: 14, bottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, zIndex: 2 }}>
              <QRBox dataUrl={qrContactDataUrl} size={40} />
            </div>
          </div>
        )
      }

      // ── DARK LUXURY: Deep black + gold geometric frame ─────────────
      if (tKey === 'darkluxury') {
        return (
          <div style={{ width: '100%', height: '100%', borderRadius: 13, overflow: 'hidden', position: 'relative', background: `linear-gradient(135deg,${bg1},${bg2})` }}>
            {/* Ornate gold corners */}
            {[
              { top: 8, left: 8, borderTop: `1.5px solid ${acc}`, borderLeft: `1.5px solid ${acc}` },
              { top: 8, right: 8, borderTop: `1.5px solid ${acc}`, borderRight: `1.5px solid ${acc}` },
              { bottom: 8, left: 8, borderBottom: `1.5px solid ${acc}`, borderLeft: `1.5px solid ${acc}` },
              { bottom: 8, right: 8, borderBottom: `1.5px solid ${acc}`, borderRight: `1.5px solid ${acc}` },
            ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 22, height: 22, ...s, opacity: 0.7 }} />)}
            {/* Inner frame */}
            <div style={{ position: 'absolute', inset: 14, border: `0.5px solid ${acc}22`, borderRadius: 4, pointerEvents: 'none' }} />
            {/* Diamond pattern top */}
            <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, background: i === 1 ? acc : 'transparent', border: `0.5px solid ${acc}`, transform: 'rotate(45deg)' }} />)}
            </div>
            {/* Content */}
            <div style={{ padding: '30px 24px 20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ fontFamily: ff, fontSize: 'clamp(16px,3.5vw,21px)', fontWeight: 700, color: tc, letterSpacing: '.04em', textAlign: 'center' }}>{user.name || 'Your Name'}</div>
              <div style={{ height: 1, width: 55, background: `linear-gradient(90deg,transparent,${acc},transparent)`, margin: '7px 0' }} />
              <div style={{ fontSize: 8, color: acc, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: 'Outfit,sans-serif' }}>{user.jobTitle || 'Job Position'}</div>
              {d.showTagline && <div style={{ fontSize: 7, color: sc, fontStyle: 'italic', marginTop: 6, fontFamily: "'DM Mono',monospace" }}>{d.tagline}</div>}
              <div style={{ marginTop: 10, display: 'flex', gap: 14, fontSize: 7, color: sc, fontFamily: "'DM Mono',monospace" }}>
                {user.email && <span>✉ {user.email}</span>}
                {user.phone && <span>✆ {user.phone}</span>}
              </div>
            </div>
            {/* QR */}
            <div style={{ position: 'absolute', right: 16, bottom: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, zIndex: 2 }}>
              <QRBox dataUrl={qrContactDataUrl} size={48} />
              <div style={{ fontSize: 6, color: acc, letterSpacing: '.1em', fontFamily: "'DM Mono',monospace" }}>SAVE</div>
            </div>
          </div>
        )
      }

      // ── Generic professional fallback ──────────────────────────────
      return (
        <div style={{ width: '100%', height: '100%', borderRadius: 13, overflow: 'hidden', position: 'relative', background: `linear-gradient(135deg,${bg1},${bg2})`, padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: ff, fontSize: 'clamp(14px,3vw,18px)', fontWeight: 700, color: tc }}>{user.name || 'Your Name'}</div>
            <div style={{ fontSize: 8, color: acc, letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 3, fontFamily: 'Outfit,sans-serif' }}>{user.jobTitle || 'Position'}</div>
          </div>
          <div>
            <ContactRow icon="✆" value={user.phone} />
            <ContactRow icon="✉" value={user.email} />
          </div>
          <div style={{ position: 'absolute', ...qrPos, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <QRBox dataUrl={qrContactDataUrl} size={46} />
          </div>
        </div>
      )
    }

    // ─── JIMMYBROOK STYLE: dark top + gold accent strip + QR top-right ───
    if (style === 'split' && tmpl?.label === 'JimmyBrook') {
      return (
        <div style={{ width:'100%', height:'100%', borderRadius:13, overflow:'hidden', position:'relative', background: bg1, display:'flex', flexDirection:'column' }}>
          {/* Diamond logo mark */}
          <div style={{ padding:'20px 22px 12px', flex:1, position:'relative' }}>
            <div style={{ display:'flex', gap:3, marginBottom:10 }}>
              {[0,1].map(i=><div key={i} style={{ width:14, height:14, background: i===0?acc:'transparent', border:`2px solid ${acc}`, transform:'rotate(45deg)', flexShrink:0 }}/>)}
            </div>
            <div style={{ fontFamily:ff, fontSize:'clamp(16px,3.5vw,21px)', fontWeight:700, color:tc, letterSpacing:'.02em' }}>{user.name||'Your Name'}</div>
            <div style={{ fontSize:8, color:acc, letterSpacing:'.16em', textTransform:'uppercase', marginTop:3, fontFamily:'Outfit,sans-serif' }}>{user.jobTitle||'Full Stack Developer'}</div>
            {d.showTagline && <div style={{ fontSize:8, color:sc, fontStyle:'italic', fontFamily:"'DM Mono',monospace", marginTop:4 }}>{d.tagline}</div>}
            {/* QR top-right */}
            <div style={{ position:'absolute', top:14, right:16, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
              <QRBox dataUrl={qrContactDataUrl} size={52} />
              <div style={{ fontSize:7, color:sc, letterSpacing:'.08em', textTransform:'uppercase', fontFamily:"'DM Mono',monospace" }}>Save</div>
            </div>
          </div>
          {/* Gold strip */}
          <div style={{ background:`linear-gradient(90deg,${acc},#E8C870)`, padding:'7px 22px', textAlign:'center' }}>
            <div style={{ fontSize:9, color:'rgba(10,10,10,.85)', fontFamily:"'DM Mono',monospace", fontWeight:500 }}>{user.portfolioUrl||user.email||'www.yoursite.com'}</div>
          </div>
        </div>
      )
    }

    // ─── BLUECORP STYLE: geometric grid top + white/blue split bottom ───
    if (style === 'geometric') {
      return (
        <div style={{ width:'100%', height:'100%', borderRadius:13, overflow:'hidden', background:'#fff', display:'flex', flexDirection:'column', position:'relative' }}>
          {/* Blue top */}
          <div style={{ background:`linear-gradient(135deg,${bg1} 0%,${bg2} 100%)`, padding:'18px 20px 14px', position:'relative', flex:'0 0 55%' }}>
            {/* Geometric grid dots */}
            <div style={{ position:'absolute', right:0, top:0, width:'45%', height:'100%', opacity:.25, backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 8px,${acc}33 8px,${acc}33 9px),repeating-linear-gradient(90deg,transparent,transparent 8px,${acc}33 8px,${acc}33 9px)` }} />
            <div style={{ fontFamily:ff, fontSize:'clamp(13px,3vw,17px)', fontWeight:700, color:tc, letterSpacing:'.04em', textTransform:'uppercase' }}>{user.company||'Company'}</div>
            <div style={{ fontSize:8, color:sc, letterSpacing:'.14em', textTransform:'uppercase', marginTop:2 }}>{d.showTagline ? d.tagline : user.portfolioUrl}</div>
          </div>
          {/* Light bottom */}
          <div style={{ flex:1, background:`${acc}22`, padding:'8px 20px', borderTop:`2px solid ${acc}` }}>
            <div style={{ fontSize:8, color:bg1, fontFamily:"'DM Mono',monospace", marginBottom:2 }}>{user.portfolioUrl||'yoursite.com'}</div>
            <div style={{ fontSize:7, color:bg1+'99', fontFamily:"'DM Mono',monospace" }}>{user.linkedin||'linkedin.com/in/you'}</div>
          </div>
          {/* QR */}
          <div style={{ position:'absolute', ...qrPos, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
            <QRBox dataUrl={qrContactDataUrl} size={46} />
            <div style={{ fontSize:7, color:sc, letterSpacing:'.08em', textTransform:'uppercase', fontFamily:"'DM Mono',monospace" }}>Save</div>
          </div>
        </div>
      )
    }

    // ─── AQUACLEAN / BUBBLE STYLE: white + circle orbs + gradient QR box ───
    if (style === 'bubble') {
      return (
        <div style={{ width:'100%', height:'100%', borderRadius:13, overflow:'hidden', background:'#fff', position:'relative', padding:'0' }}>
          {/* Bubble orbs */}
          {[[8,8,18],[30,60,10],[75,5,14],[85,55,8],[50,40,6]].map(([x,y,r],i)=>(
            <div key={i} style={{ position:'absolute', left:`${x}%`, top:`${y}%`, width:r, height:r, borderRadius:'50%', background:`${acc}22`, border:`1px solid ${acc}33` }} />
          ))}
          {/* Vertical divider */}
          <div style={{ position:'absolute', left:'42%', top:'15%', bottom:'15%', width:1, background:`linear-gradient(to bottom,transparent,${acc},transparent)` }} />
          {/* Left: QR with gradient bg */}
          <div style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <div style={{ background:`linear-gradient(135deg,${bg1},${bg2})`, borderRadius:8, padding:5, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <QRBox dataUrl={qrContactDataUrl} size={52} />
            </div>
            <div style={{ fontSize:7, color:acc, letterSpacing:'.08em', fontFamily:"'DM Mono',monospace" }}>SCAN ME</div>
          </div>
          {/* Right: info */}
          <div style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-55%)', width:'52%' }}>
            <div style={{ fontFamily:ff, fontSize:'clamp(12px,2.5vw,15px)', fontWeight:700, color:tc==='#FFFFFF'?'#0F172A':tc, lineHeight:1.2 }}>{user.name||'Your Name'}</div>
            <div style={{ fontSize:7, color:acc, letterSpacing:'.14em', textTransform:'uppercase', marginTop:3, fontFamily:'Outfit,sans-serif' }}>{user.jobTitle||'Job Position'}</div>
            <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:4 }}>
              {[
                {icon:'✉', val:user.email},
                {icon:'✆', val:user.phone},
                {icon:'◎', val:user.portfolioUrl||user.city},
              ].filter(r=>r.val).map((r,i)=>(
                <div key={i} style={{ display:'flex', gap:5, alignItems:'center' }}>
                  <span style={{ fontSize:8, color:acc }}>{r.icon}</span>
                  <span style={{ fontSize:7, color:'#475569', fontFamily:"'DM Mono',monospace", overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Bottom accent */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${bg1},${acc},${bg2})` }} />
        </div>
      )
    }

    // ─── DIAGONAL STYLE: angled stripe ───────────────────────────────────
    if (style === 'diagonal') {
      return (
        <div style={{ width:'100%', height:'100%', borderRadius:13, overflow:'hidden', position:'relative', background: bg1 }}>
          {/* Diagonal stripe */}
          <div style={{ position:'absolute', top:'-20%', right:'-10%', width:'60%', height:'160%', background:`linear-gradient(135deg,${acc}33,${acc}11)`, transform:'rotate(-15deg)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', top:0, right:0, width:'3px', height:'100%', background:`linear-gradient(to bottom,${acc},transparent)` }} />
          {/* Content */}
          <div style={{ padding:'22px 20px', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative', zIndex:1 }}>
            <div style={{ textAlign: isCenter ? 'center' : 'left' }}>
              <div style={{ fontFamily:ff, fontSize:'clamp(16px,3.5vw,21px)', fontWeight:700, color:tc }}>{user.name||'Your Name'}</div>
              <div style={{ fontSize:8, color:acc, letterSpacing:'.17em', textTransform:'uppercase', marginTop:3, fontFamily:'Outfit,sans-serif' }}>{user.jobTitle||'Developer'}</div>
              {d.showGoldLine && <div style={{ height:1, background:`linear-gradient(90deg,transparent,${acc},transparent)`, margin:'7px 0', width:'55%' }} />}
              {d.showTagline && <div style={{ fontSize:8, color:sc, fontStyle:'italic', fontFamily:"'DM Mono',monospace" }}>{d.tagline}</div>}
            </div>
            <div>
              <div style={{ fontSize:8, color:sc, fontFamily:"'DM Mono',monospace", marginBottom:3 }}>✉ {user.email||''}</div>
              {user.phone && <div style={{ fontSize:8, color:sc, fontFamily:"'DM Mono',monospace" }}>✆ {user.phone}</div>}
            </div>
          </div>
          <div style={{ position:'absolute', ...qrPos, display:'flex', flexDirection:'column', alignItems:'center', gap:3, zIndex:2 }}>
            <QRBox dataUrl={qrContactDataUrl} size={48} />
            <div style={{ fontSize:7, color:sc, letterSpacing:'.08em', textTransform:'uppercase', fontFamily:"'DM Mono',monospace" }}>Save</div>
          </div>
        </div>
      )
    }

    // ─── MODERN / MINIMAL STYLE ───────────────────────────────────────────
    if (style === 'modern') {
      return (
        <div style={{ width:'100%', height:'100%', borderRadius:13, overflow:'hidden', position:'relative', background: bg1 }}>
          {/* Top accent bar */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${acc},${bg2})` }} />
          <div style={{ padding:'20px 22px', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            <div style={{ textAlign: isCenter ? 'center' : 'left' }}>
              <div style={{ fontFamily:ff, fontSize:'clamp(14px,3.2vw,19px)', fontWeight:700, color:tc, letterSpacing: style==='modern'&&d.fontFamily==='bebas'?'.08em':'.02em', textTransform: d.fontFamily==='bebas'?'uppercase':'none' }}>
                {user.name||'Your Name'}
              </div>
              <div style={{ fontSize:8, color:acc, letterSpacing:'.17em', textTransform:'uppercase', marginTop:3, fontFamily:'Outfit,sans-serif' }}>{user.jobTitle||'Developer'}</div>
              {d.showTagline && <div style={{ fontSize:8, color:sc, fontStyle:'italic', fontFamily:"'DM Mono',monospace", marginTop:6 }}>{d.tagline}</div>}
            </div>
            <div>
              <div style={{ fontSize:8, color:sc, fontFamily:"'DM Mono',monospace", marginBottom:3 }}>✉ {user.email||''}</div>
              {user.phone && <div style={{ fontSize:8, color:sc, fontFamily:"'DM Mono',monospace" }}>✆ {user.phone}</div>}
            </div>
          </div>
          <div style={{ position:'absolute', ...qrPos, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
            <QRBox dataUrl={qrContactDataUrl} size={48} />
            <div style={{ fontSize:7, color:sc, letterSpacing:'.08em', textTransform:'uppercase', fontFamily:"'DM Mono',monospace" }}>Save</div>
          </div>
        </div>
      )
    }

    // ─── CLASSIC (default) ────────────────────────────────────────────────
    return (
      <div style={{ width:'100%', height:'100%', borderRadius:13, background:`linear-gradient(135deg,${bg1} 0%,${bg2} 55%,${bg1} 100%)`, padding:'20px 24px', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative', overflow:'hidden' }}>
        {d.showCornerDeco && <>
          <div style={{ position:'absolute',top:10,left:10,width:16,height:16,borderTop:`1.5px solid ${acc}`,borderLeft:`1.5px solid ${acc}`,opacity:.5 }}/>
          <div style={{ position:'absolute',top:10,right:10,width:16,height:16,borderTop:`1.5px solid ${acc}`,borderRight:`1.5px solid ${acc}`,opacity:.5 }}/>
          <div style={{ position:'absolute',bottom:10,left:10,width:16,height:16,borderBottom:`1.5px solid ${acc}`,borderLeft:`1.5px solid ${acc}`,opacity:.5 }}/>
          <div style={{ position:'absolute',bottom:10,right:10,width:16,height:16,borderBottom:`1.5px solid ${acc}`,borderRight:`1.5px solid ${acc}`,opacity:.5 }}/>
        </>}
        <div style={{ textAlign: isCenter ? 'center' : 'left' }}>
          <div style={{ fontFamily:ff, fontSize:'clamp(17px,3.8vw,22px)', fontWeight:700, color:tc, letterSpacing:'.02em' }}>{user.name||'Your Name'}</div>
          <div style={{ fontSize:9, color:acc, letterSpacing:'.17em', textTransform:'uppercase', marginTop:4, fontFamily:'Outfit,sans-serif' }}>{user.jobTitle||'Full Stack Developer'}</div>
          {d.showGoldLine && <div style={{ height:1, background:`linear-gradient(90deg,transparent,${acc},transparent)`, margin:'7px 0', width: isCenter?'60%':'55%', ...(isCenter?{marginLeft:'auto',marginRight:'auto'}:{}) }} />}
          {d.showTagline && <div style={{ fontSize:8, color:sc, fontStyle:'italic', fontFamily:"'DM Mono',monospace", marginTop:2 }}>{d.tagline||''}</div>}
        </div>
        <div>
          <div style={{ fontSize:8, color:sc, fontFamily:"'DM Mono',monospace", marginBottom:3 }}>✉ {user.email||''}</div>
          {user.phone && <div style={{ fontSize:8, color:sc, fontFamily:"'DM Mono',monospace" }}>✆ {user.phone}</div>}
        </div>
        <div style={{ position:'absolute', ...qrPos, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
          <QRBox dataUrl={qrContactDataUrl} size={56} />
          <div style={{ fontSize:7, color:sc, letterSpacing:'.08em', textTransform:'uppercase', fontFamily:"'DM Mono',monospace" }}>Save Contact</div>
        </div>
      </div>
    )
  }

  // ════ BACK FACE ════════════════════════════════════════════════════════
  const isLightBg = tmpl?.category === 'light' || tmpl?.category === 'minimal' || tmpl?.category === 'professional'
  const backTextColor = isLightBg ? '#0F172A' : tc
  const isDarkPro = style === 'professional' && (bg1.match(/^#[0-3]/) || bg1 === '#0A0A0A' || bg1 === '#0D1117')

  return (
    <div style={{ width:'100%', height:'100%', borderRadius:13, background:`linear-gradient(135deg,${bg1} 0%,${bg2} 100%)`, padding:'18px 22px', display:'flex', alignItems:'center', gap:16, overflow:'hidden', position:'relative' }}>
      {/* Subtle pattern for geometric/bubble/professional styles */}
      {(style==='geometric'||style==='bubble'||style==='professional') && (
        <div style={{ position:'absolute', inset:0, opacity:.06, backgroundImage:`repeating-linear-gradient(45deg,${acc} 0,${acc} 1px,transparent 0,transparent 50%)`, backgroundSize:'12px 12px', pointerEvents:'none' }} />
      )}
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12, position:'relative', zIndex:1 }}>
        <div>
          <div style={{ fontSize:8, color:acc, letterSpacing:'.17em', textTransform:'uppercase', marginBottom:6, fontFamily:'Outfit,sans-serif' }}>Tech Stack</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
            {(user.skills||[]).slice(0,6).map(s=>(
              <span key={s} style={{ fontSize:7, padding:'2px 6px', border:`0.5px solid ${acc}44`, borderRadius:12, color:(isLightBg && !isDarkPro)?acc:sc, fontFamily:"'DM Mono',monospace", background: (isLightBg && !isDarkPro)?`${acc}15`:'transparent' }}>{s}</span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize:8, color:acc, letterSpacing:'.17em', textTransform:'uppercase', marginBottom:4, fontFamily:'Outfit,sans-serif' }}>Connect</div>
          {user.github   && <div style={{ fontSize:7, color:(isLightBg && !isDarkPro)?'#475569':sc, fontFamily:"'DM Mono',monospace", marginBottom:2 }}>{user.github}</div>}
          {user.linkedin && <div style={{ fontSize:7, color:(isLightBg && !isDarkPro)?'#475569':sc, fontFamily:"'DM Mono',monospace" }}>{user.linkedin}</div>}
        </div>
        {user.phone && (
          <div style={{ fontSize:7, color:(isLightBg && !isDarkPro)?'#475569':sc, fontFamily:"'DM Mono',monospace" }}>✆ {user.phone}</div>
        )}
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flexShrink:0, position:'relative', zIndex:1 }}>
        <div style={{ background: (isLightBg && !isDarkPro)?`${bg1}22`:'transparent', borderRadius:10, padding:2 }}>
          <QRBox dataUrl={qrPortfolioDataUrl} size={64} />
        </div>
        <div style={{ fontSize:7, color:(isLightBg && !isDarkPro)?acc:sc, letterSpacing:'.08em', textTransform:'uppercase', fontFamily:"'DM Mono',monospace" }}>Portfolio</div>
      </div>
    </div>
  )
}

interface CardPreviewProps {
  user: Partial<User>
  design: Partial<CardDesign>
  qrContact?: string
  qrPortfolio?: string
  flipped?: boolean
  onFlip?: () => void
  style?: React.CSSProperties
  size?: 'sm' | 'md' | 'lg'
}

export function CardPreview({ user, design, qrContact, qrPortfolio, flipped=false, onFlip, style, size='md' }: CardPreviewProps) {
  const shadow = size === 'sm' ? '0 8px 24px rgba(0,0,0,.4)' : '0 20px 60px rgba(0,0,0,.5)'
  return (
    <div onClick={onFlip} style={{ perspective:1400, width:'100%', aspectRatio:'1.586/1', cursor:onFlip?'pointer':'default', ...style }}>
      <div style={{ width:'100%', height:'100%', transformStyle:'preserve-3d', transition:'transform .7s cubic-bezier(.4,0,.2,1)', transform:flipped?'rotateY(180deg)':'none', position:'relative' }}>
        <div style={{ position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden', borderRadius:13, overflow:'hidden', boxShadow:shadow }}>
          <CardFace user={user} design={design} side="front" qrContactDataUrl={qrContact} />
        </div>
        <div style={{ position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden', borderRadius:13, overflow:'hidden', boxShadow:shadow, transform:'rotateY(180deg)' }}>
          <CardFace user={user} design={design} side="back" qrPortfolioDataUrl={qrPortfolio} />
        </div>
      </div>
    </div>
  )
}
