'use client'
import { User } from '@/types'

export type Page = 'dashboard' | 'info' | 'themes' | 'design' | 'qrtest' | 'analytics' | 'docs' | 'setup'

const NAV_ITEMS: { id: Page; label: string; section?: string }[] = [
  { id: 'dashboard', label: 'Dashboard',     section: 'Overview' },
  { id: 'info',      label: 'Card Info',     section: 'Card Builder' },
  { id: 'themes',    label: 'Theme Gallery'  },
  { id: 'design',    label: 'Customize'      },
  { id: 'qrtest',   label: 'QR System Test', section: 'Tools' },
  { id: 'analytics', label: 'Analytics'      },
  { id: 'docs',      label: 'User Guide',    section: 'Help' },
  { id: 'setup',     label: 'Setup Guide'    },
]

const ICONS: Record<Page, React.ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  info:      <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  themes:    <><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></>,
  design:    <><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 20v-4M4 20h16"/></>,
  qrtest:    <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 17h3v3"/></>,
  analytics: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
  docs:      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></>,
  setup:     <><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></>,
}

interface SidebarProps {
  page: Page
  user: User | null
  onNavigate: (p: Page) => void
  onLogout: () => void
}

export function Sidebar({ page, user, onNavigate, onLogout }: SidebarProps) {
  const initials = (user?.name || 'U').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
  let lastSection = ''

  return (
    <div style={{ width:220, minWidth:220, background:'var(--bg2)', borderRight:'0.5px solid var(--brd)', display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      <div style={{ padding:'18px 16px', borderBottom:'0.5px solid var(--brd)', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:30, height:30, background:'linear-gradient(135deg,#C9A84C,#8B6A1E)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#000', flexShrink:0 }}>SC</div>
        <div>
          <div style={{ fontSize:13, fontWeight:600, letterSpacing:'.04em' }}>SmartCard</div>
          <div style={{ fontSize:9, color:'var(--mt)', fontFamily:"'DM Mono',monospace" }}>v2.0</div>
        </div>
      </div>

      <nav style={{ padding:'8px 8px', flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:1 }}>
        {NAV_ITEMS.map(n => {
          const showSection = n.section && n.section !== lastSection
          if (showSection) lastSection = n.section!
          return (
            <div key={n.id}>
              {showSection && (
                <div style={{ padding:'10px 10px 4px', fontSize:9, color:'var(--mt2)', letterSpacing:'.1em', textTransform:'uppercase', fontFamily:"'DM Mono',monospace" }}>
                  {n.section}
                </div>
              )}
              <button
                onClick={() => onNavigate(n.id)}
                style={{
                  display:'flex', alignItems:'center', gap:9, padding:'8px 10px',
                  borderRadius:7, border:'none', width:'100%', textAlign:'left',
                  cursor:'pointer', fontSize:12, fontWeight: page===n.id ? 500 : 400,
                  background: page===n.id ? 'var(--goldx)' : 'transparent',
                  color: page===n.id ? 'var(--gold)' : 'var(--mt)',
                  transition:'background .15s,color .15s', fontFamily:'Outfit,sans-serif',
                }}
                onMouseEnter={e=>{if(page!==n.id){(e.currentTarget as HTMLButtonElement).style.background='var(--bg3)';(e.currentTarget as HTMLButtonElement).style.color='var(--tx)'}}}
                onMouseLeave={e=>{if(page!==n.id){(e.currentTarget as HTMLButtonElement).style.background='transparent';(e.currentTarget as HTMLButtonElement).style.color='var(--mt)'}}}
              >
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, opacity:.8 }}>
                  {ICONS[n.id]}
                </svg>
                {n.label}
                {n.id==='themes' && <span style={{ marginLeft:'auto', fontSize:9, background:'var(--gold)', color:'#000', borderRadius:4, padding:'1px 5px', fontWeight:700 }}>20</span>}
              </button>
            </div>
          )
        })}
      </nav>

      <div style={{ margin:8 }}>
        <div style={{ padding:10, background:'var(--bg3)', borderRadius:8, border:'0.5px solid var(--brd)', display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <div style={{ width:26, height:26, borderRadius:'50%', background:'linear-gradient(135deg,#C9A84C,#8B6A1E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, color:'#000', flexShrink:0 }}>{initials}</div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:11, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name||'User'}</div>
            <div style={{ fontSize:9, color:'var(--mt)', fontFamily:"'DM Mono',monospace" }}>/{user?.slug||''}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ width:'100%', padding:'7px 10px', background:'transparent', border:'0.5px solid var(--brd)', borderRadius:7, color:'var(--mt)', fontSize:11, cursor:'pointer', fontFamily:'Outfit,sans-serif' }}>Logout</button>
      </div>
    </div>
  )
}
