'use client'

import { useState } from 'react'
import { CardPreview } from '@/components/card/CardPreview'
import { User, CardDesign, QRData } from '@/types'

interface InfoPageProps {
  user: User
  qr: QRData
  token: string
  onSave: (updatedUser: User, newQr: QRData) => void
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

export function InfoPage({ user, qr, token, onSave, toast }: InfoPageProps) {
  const [form, setForm] = useState({
    name: user.name || '', jobTitle: user.jobTitle || '', email: user.email || '',
    phone: user.phone || '', company: user.company || '', city: user.city || '',
    portfolioUrl: user.portfolioUrl || '', github: user.github || '',
    linkedin: user.linkedin || '', twitter: user.twitter || '',
    skills: (user.skills || []).join(', '),
  })
  const [saving, setSaving] = useState(false)
  const [flipped, setFlipped] = useState(false)

  const previewUser: Partial<User> = {
    ...user,
    name: form.name, jobTitle: form.jobTitle, email: form.email,
    phone: form.phone, github: form.github, linkedin: form.linkedin,
    portfolioUrl: form.portfolioUrl,
    skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/card/info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onSave(data.user, data.qr)
      toast('Info saved successfully!')
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const inp = (label: string, key: keyof typeof form, placeholder = '') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
      <label style={{ fontSize: 10, fontWeight: 500, color: 'var(--mt)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</label>
      <input
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        style={{ background: 'var(--bg3)', border: '0.5px solid var(--brd)', borderRadius: 7, padding: '8px 11px', color: 'var(--tx)', fontSize: 12, outline: 'none', width: '100%' }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--brd)'}
      />
    </div>
  )

  const card = { background: 'var(--bg2)', border: '0.5px solid var(--brd)', borderRadius: 11, padding: 16, marginBottom: 14 }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <div>
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Personal Info</div>
          {inp('Full Name',  'name',     'Gaurav Sharma')}
          {inp('Job Title',  'jobTitle', 'Full Stack Developer · MERN')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>{inp('Email', 'email', 'you@example.com')}</div>
            <div>{inp('Phone', 'phone', '+91 98765 43210')}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>{inp('Company', 'company', 'Freelance')}</div>
            <div>{inp('City',    'city',    'Jaipur, Rajasthan')}</div>
          </div>
        </div>

        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Social Links</div>
          {inp('Portfolio URL (Back QR target)', 'portfolioUrl', 'https://yoursite.com')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>{inp('GitHub',   'github',   'github.com/username')}</div>
            <div>{inp('LinkedIn', 'linkedin', 'linkedin.com/in/username')}</div>
          </div>
          {inp('Twitter', 'twitter', '@username')}
        </div>

        <div style={{ ...card, marginBottom: 0 }}>
          {inp('Skills (comma separated)', 'skills', 'React, Node.js, MongoDB, Express')}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{ width: '100%', marginTop: 14, padding: 11, background: 'linear-gradient(135deg,#C9A84C,#9A7A28)', borderRadius: 10, border: 'none', color: '#000', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div>
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Live Preview</div>
            <button onClick={() => setFlipped(f => !f)} style={{ padding: '4px 10px', background: 'transparent', border: '0.5px solid var(--brd2)', borderRadius: 6, color: 'var(--tx)', fontSize: 11, cursor: 'pointer' }}>Flip ↕</button>
          </div>
          <CardPreview user={previewUser} design={user.cardDesign as CardDesign} qrContact={qr.contact} qrPortfolio={qr.portfolio} flipped={flipped} onFlip={() => setFlipped(f => !f)} />
          <div style={{ marginTop: 10, padding: 10, background: 'var(--bg3)', borderRadius: 8, border: '0.5px solid var(--brd)' }}>
            <div style={{ fontSize: 10, color: 'var(--mt)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Fields on card</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['Name','Title','Email','Phone','Skills','GitHub','LinkedIn','Portfolio QR'].map(t => (
                <span key={t} style={{ fontSize: 10, padding: '2px 8px', background: 'var(--bg4)', border: '0.5px solid var(--brd)', borderRadius: 12, color: 'var(--mt)', fontFamily: "'DM Mono',monospace" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
