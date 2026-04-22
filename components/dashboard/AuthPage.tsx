'use client'

import { useState } from 'react'

interface AuthPageProps {
  onLogin:    (email: string, password: string) => Promise<string | null>
  onRegister: (name: string, email: string, password: string, slug: string) => Promise<string | null>
}

export function AuthPage({ onLogin, onRegister }: AuthPageProps) {
  const [mode, setMode]         = useState<'login' | 'register'>('login')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [form, setForm]         = useState({ name: '', email: '', password: '', slug: '' })

  const upd = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    let err: string | null = null
    if (mode === 'login') {
      err = await onLogin(form.email, form.password)
    } else {
      err = await onRegister(form.name, form.email, form.password, form.slug)
    }
    if (err) setError(err)
    setLoading(false)
  }

  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSubmit() }

  const inp = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--mt)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={e => upd(key, key === 'slug' ? e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'') : e.target.value)}
        onKeyDown={onKey}
        style={{ background: 'var(--bg3)', border: '0.5px solid var(--brd)', borderRadius: 8, padding: '10px 12px', color: 'var(--tx)', fontSize: 13, outline: 'none', width: '100%' }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--brd)'}
      />
      {key === 'slug' && form.slug && (
        <div style={{ fontSize: 11, color: 'var(--mt)', fontFamily: "'DM Mono',monospace" }}>
          Contact URL: <span style={{ color: 'var(--gold)' }}>/api/contact/{form.slug}</span>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'var(--bg2)', border: '0.5px solid var(--brd)', borderRadius: 18, padding: 36 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 50, height: 50, background: 'linear-gradient(135deg,#C9A84C,#8B6A1E)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#000', margin: '0 auto 14px' }}>SC</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--tx)', margin: '0 0 4px' }}>SmartCard</h1>
          <p style={{ fontSize: 12, color: 'var(--mt)', margin: 0 }}>Your premium digital business card</p>
        </div>

        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 3, background: 'var(--bg3)', borderRadius: 8, padding: 3, marginBottom: 22 }}>
          {(['login','register'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }} style={{ flex: 1, padding: '7px 12px', border: 'none', background: mode === m ? 'var(--bg4)' : 'transparent', color: mode === m ? 'var(--tx)' : 'var(--mt)', fontSize: 12, fontWeight: 500, borderRadius: 6, cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'Outfit, sans-serif' }}>
              {m === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        {mode === 'register' && inp('Full Name', 'name', 'text', 'Gaurav Sharma')}
        {inp('Email', 'email', 'email', 'you@example.com')}
        {inp('Password', 'password', 'password', 'Min 6 characters')}
        {mode === 'register' && inp('Card Slug (your unique URL)', 'slug', 'text', 'gaurav')}

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(231,76,60,.1)', border: '0.5px solid rgba(231,76,60,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: '#E74C3C' }}>
            {error}
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: 12, background: loading ? 'rgba(201,168,76,.4)' : 'linear-gradient(135deg,#C9A84C,#9A7A28)', borderRadius: 10, border: 'none', color: '#000', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', marginTop: 4 }}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: 'var(--mt)' }}>
          {mode === 'login' ? 'No account? ' : 'Have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: 12, fontFamily: 'Outfit, sans-serif' }}>
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
