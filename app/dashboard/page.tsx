'use client'

import { useState } from 'react'
import { Sidebar, Page } from '@/components/dashboard/Sidebar'
import { DashboardPage } from '@/components/dashboard/DashboardPage'
import { InfoPage }       from '@/components/dashboard/InfoPage'
import { ThemeGallery }  from '@/components/dashboard/ThemeGallery'
import { DesignPage }    from '@/components/dashboard/DesignPage'
import { QRTestPage }    from '@/components/dashboard/QRTestPage'
import { AnalyticsPage } from '@/components/dashboard/AnalyticsPage'
import { DocsPage }      from '@/components/dashboard/DocsPage'
import { SetupPage }     from '@/components/dashboard/SetupPage'
import { AuthPage }      from '@/components/dashboard/AuthPage'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { User, CardDesign, QRData } from '@/types'

const PAGE_TITLES: Record<Page, string> = {
  dashboard: 'Dashboard',
  info:      'Card Info',
  themes:    'Theme Gallery',
  design:    'Customize Design',
  qrtest:    'QR System Test',
  analytics: 'Analytics',
  docs:      'User Guide',
  setup:     'Setup Guide',
}

function DashboardShell() {
  const { user, token, cardData, loading, login, register, logout, updateCardData } = useAuth()
  const { toasts, toast } = useToast()
  const [page, setPage] = useState<Page>('dashboard')

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)', flexDirection:'column', gap:16 }}>
      <div style={{ width:20, height:20, border:'2px solid rgba(255,255,255,.15)', borderTopColor:'#C9A84C', borderRadius:'50%', animation:'spin .6s linear infinite' }} />
      <div style={{ fontSize:13, color:'var(--mt)' }}>Loading SmartCard...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!user || !token) return (
    <>
      <AuthPage onLogin={login} onRegister={register} />
      <ToastContainer toasts={toasts} />
    </>
  )

  const appUrl   = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_APP_URL || window.location.origin) : ''
  const vCardUrl = cardData?.vCardUrl || `${appUrl}/api/contact/${user.slug}`
  const qr: QRData = cardData?.qr || { contact:'', portfolio:'' }

  const handleInfoSave = (updatedUser: User, newQr: QRData) => {
    updateCardData({ user: updatedUser, qr: newQr })
    toast('Info saved — QR codes updated!')
  }

  const handleDesignSave = (design: CardDesign) => {
    if (cardData?.user) updateCardData({ user: { ...cardData.user, cardDesign: design } })
    toast('Design saved!')
  }

  const handleThemeSelect = (templateKey: string, design: Partial<CardDesign>) => {
    if (cardData?.user) {
      const merged = { ...cardData.user.cardDesign, ...design, template: templateKey }
      updateCardData({ user: { ...cardData.user, cardDesign: merged as CardDesign } })
    }
  }

  const curUser = cardData?.user || user

  return (
    <div style={{ display:'flex', height:'100vh', background:'var(--bg)', overflow:'hidden' }}>
      <Sidebar page={page} user={curUser} onNavigate={setPage} onLogout={logout} />

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Topbar */}
        <div style={{ padding:'12px 22px', borderBottom:'0.5px solid var(--brd)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, background:'var(--bg)' }}>
          <div style={{ fontSize:14, fontWeight:500, color:'var(--tx)' }}>{PAGE_TITLES[page]}</div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ padding:'2px 10px', borderRadius:20, background:'rgba(46,204,113,.1)', color:'#2ECC71', border:'0.5px solid rgba(46,204,113,.2)', fontSize:11 }}>Live</span>
            <a href={vCardUrl} target="_blank" rel="noreferrer"
              style={{ padding:'6px 12px', background:'transparent', border:'0.5px solid var(--brd2)', borderRadius:7, color:'var(--tx)', fontSize:12, textDecoration:'none' }}>
              Test vCard ↗
            </a>
            <button onClick={logout} style={{ padding:'6px 12px', background:'transparent', border:'0.5px solid var(--brd)', borderRadius:7, color:'var(--mt)', fontSize:12, cursor:'pointer' }}>Logout</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:22 }}>
          {page==='dashboard' && cardData && (
            <DashboardPage user={cardData.user} qr={qr} vCardUrl={vCardUrl} onNavigate={p=>setPage(p as Page)} toast={toast} />
          )}
          {page==='info' && cardData && (
            <InfoPage user={cardData.user} qr={qr} token={token} onSave={handleInfoSave} toast={toast} />
          )}
          {page==='themes' && cardData && (
            <ThemeGallery user={cardData.user} currentDesign={cardData.user.cardDesign} onSelectTheme={handleThemeSelect} toast={toast} />
          )}
          {page==='design' && cardData && (
            <DesignPage user={cardData.user} qr={qr} token={token} onSave={handleDesignSave} toast={toast} />
          )}
          {page==='qrtest' && cardData && (
            <QRTestPage user={cardData.user} qr={qr} vCardUrl={vCardUrl} token={token} toast={toast} />
          )}
          {page==='analytics' && (
            <AnalyticsPage user={cardData?.user || user} token={token} />
          )}
          {page==='docs' && <DocsPage />}
          {page==='setup' && (
            <SetupPage user={curUser} vCardUrl={vCardUrl} toast={toast} />
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export default function Dashboard() {
  return <AuthProvider><DashboardShell /></AuthProvider>
}
