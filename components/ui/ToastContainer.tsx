'use client'

import { Toast, ToastType } from '@/hooks/useToast'

const colors: Record<ToastType, { bg: string; border: string; color: string; icon: string }> = {
  success: { bg: '#0f2e1a', border: 'rgba(46,204,113,.25)', color: '#2ECC71', icon: '✓' },
  error:   { bg: '#2e0f0f', border: 'rgba(231,76,60,.25)',  color: '#E74C3C', icon: '✕' },
  info:    { bg: '#0f1e2e', border: 'rgba(59,139,212,.25)', color: '#3B8BD4', icon: 'ℹ' },
}

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => {
        const c = colors[t.type]
        return (
          <div key={t.id} style={{
            background: c.bg, border: `0.5px solid ${c.border}`, color: c.color,
            padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 8, minWidth: 220,
            animation: 'slideIn .25s ease',
          }}>
            <span>{c.icon}</span>
            <span style={{ color: '#F0EFE8' }}>{t.message}</span>
          </div>
        )
      })}
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  )
}
