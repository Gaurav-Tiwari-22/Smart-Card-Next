'use client'

import { User } from '@/types'

interface SetupPageProps {
  user: User
  vCardUrl: string
  toast: (msg: string) => void
}

const steps = [
  { n: 1, t: 'Backend (API Routes)', d: 'Is project mein backend already Next.js API routes ke andar hai. Alag server deploy karne ki zaroorat nahi!', chips: ['Next.js 16', 'Turbopack', 'No Express needed'] },
  { n: 2, t: 'MongoDB Connect karo', d: '.env.local file mein MONGODB_URI aur JWT_SECRET add karo. MongoDB Atlas free tier use karo.', chips: ['MongoDB Atlas', '.env.local', 'Free tier'] },
  { n: 3, t: 'Vercel pe Deploy karo', d: 'GitHub se connect karo, environment variables add karo, aur deploy karo. Ek click mein live!', chips: ['Vercel (free)', 'GitHub CI', 'Auto-deploy'] },
  { n: 4, t: 'NEXT_PUBLIC_APP_URL set karo', d: 'Ye BAHUT important hai! Contact QR mein ye URL encode hoti hai. Galat URL = QR mein scan pe error. Deploy ke baad apna domain yahan dalo.', chips: ['Critical!', 'QR URL', 'yourdomain.com'] },
  { n: 5, t: 'Domain Connect karo', d: 'Namecheap ya GoDaddy se domain lo. Vercel pe DNS configure karo. ~₹600/yr.', chips: ['~₹600/yr', 'Namecheap', 'Vercel DNS'] },
  { n: 6, t: 'Card Download & Print', d: 'Dashboard se Front + Back directly PNG mein download karo (1050×660px). Print shop ko de do — Figma ki zaroorat nahi!', chips: ['PNG Export', '1050×660px', 'Print-ready'] },
  { n: 7, t: 'Scan Analytics Monitor karo', d: 'QR scan hone pe har scanner ka device, browser, OS, IP, time auto-capture hota hai. Analytics tab mein real-time data dekho.', chips: ['Real-time', 'Device Info', 'IP Tracking'] },
]

const envVars = [
  { key: 'MONGODB_URI', val: 'mongodb+srv://user:pass@cluster.mongodb.net/smartcard' },
  { key: 'JWT_SECRET',  val: 'your_random_secret_min_32_chars_change_this' },
  { key: 'NEXT_PUBLIC_APP_URL', val: 'https://yourdomain.com' },
]

export function SetupPage({ user, vCardUrl, toast }: SetupPageProps) {
  const card: React.CSSProperties = { background: 'var(--bg2)', border: '0.5px solid var(--brd)', borderRadius: 11, padding: 16 }

  return (
    <div>
      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {steps.map(s => (
          <div key={s.n} style={{ ...card, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#C9A84C,#8B6A1E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#000', flexShrink: 0 }}>{s.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{s.t}</div>
              <div style={{ fontSize: 11, color: 'var(--mt)', marginBottom: 7, lineHeight: 1.6 }}>{s.d}</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {s.chips.map(c => (
                  <span key={c} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 12, border: '0.5px solid rgba(201,168,76,.35)', color: 'var(--gold)', background: 'var(--goldx)', fontFamily: "'DM Mono',monospace" }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* .env.local */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>.env.local Setup</div>
          <div style={{ background: '#0d0d0d', borderRadius: 8, padding: 14, border: '0.5px solid rgba(201,168,76,.2)' }}>
            {envVars.map(v => (
              <div key={v.key} style={{ marginBottom: 8, fontFamily: "'DM Mono',monospace", fontSize: 11 }}>
                <span style={{ color: 'var(--gold)' }}>{v.key}</span>
                <span style={{ color: 'var(--mt)' }}>=</span>
                <span style={{ color: '#9fca78' }}>{v.val}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: 'var(--mt)', lineHeight: 1.6 }}>
            <span style={{ color: 'var(--gold)', fontWeight: 500 }}>Tip:</span> Copy <code style={{ background: 'var(--bg3)', padding: '1px 5px', borderRadius: 4, fontSize: 10 }}>.env.local.example</code> to <code style={{ background: 'var(--bg3)', padding: '1px 5px', borderRadius: 4, fontSize: 10 }}>.env.local</code> and fill in values.
          </div>
          <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(220,60,60,.08)', border: '0.5px solid rgba(220,60,60,.2)', borderRadius: 7 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#e74c3c', marginBottom: 3 }}>⚠ CRITICAL</div>
            <div style={{ fontSize: 10, color: 'var(--mt)', lineHeight: 1.5 }}>NEXT_PUBLIC_APP_URL sahi set karo! Contact QR mein ye URL encode hoti hai. Galat URL = printed QR kaam nahi karega.</div>
          </div>
        </div>

        {/* Print specs + Download specs */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Print & Download Specifications</div>
          {[
            ['Card Size',      '85mm × 54mm (standard)'],
            ['Download Size',  '1050 × 660px PNG'],
            ['Scale Factor',   '3x upscaled from preview'],
            ['Material',       'PVC 0.76mm or 350+ GSM'],
            ['Finish',         'Matte lamination (recommended)'],
            ['Color Mode',     'CMYK for print'],
            ['QR Size',        'Minimum 15mm × 15mm on card'],
            ['Themes',         '20 templates (12 + 8 professional)'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '0.5px solid var(--brd)' }}>
              <span style={{ fontSize: 11, color: 'var(--mt)' }}>{k}</span>
              <span style={{ fontSize: 11, color: 'var(--tx)', fontFamily: "'DM Mono',monospace" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* New Features Summary */}
      <div style={{ ...card, marginTop: 14, borderColor: 'rgba(46,204,113,.3)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--grn)' }}>✨ Recent Updates (Last 24 Hours)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { title: 'Smart QR System', desc: 'Contact QR ab permanent URL encode karta hai. Info update karo — QR same — reprint nahi.', icon: '🔗' },
            { title: 'Card PNG Download', desc: 'Dashboard se Front + Back directly PNG download karo. Print-ready (1050×660px).', icon: '⬇️' },
            { title: '8 Professional Themes', desc: 'Vistaprint/Freepik inspired: Aviato Red, Corporate Blue, Hexagon Tech, Dark Luxury, etc.', icon: '🎨' },
            { title: 'Scan Analytics', desc: 'Real-time scan data. Har scanner ka device, browser, OS, IP auto-capture.', icon: '📊' },
            { title: 'Scan History Table', desc: 'Analytics tab mein complete scan log table — device, time, browser sab dikhta hai.', icon: '📋' },
            { title: 'Smart QR Notice', desc: 'Dashboard pe green notice — "Update Without Reprinting" — user awareness ke liye.', icon: '✅' },
          ].map((f, i) => (
            <div key={i} style={{ padding: '10px 12px', background: 'var(--bg3)', borderRadius: 8, border: '0.5px solid var(--brd)' }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{f.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)', marginBottom: 3 }}>{f.title}</div>
              <div style={{ fontSize: 10, color: 'var(--mt)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* vCard URL */}
      <div style={{ ...card, marginTop: 14, borderColor: 'rgba(201,168,76,.3)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Your vCard URL (Contact QR target)</div>
        <div style={{ fontSize: 11, color: 'var(--mt)', marginBottom: 10, lineHeight: 1.6 }}>
          Ye URL automatically teri Contact QR ke andar encode hoti hai. Jab koi scan kare, unka phone ye URL open karta hai aur latest contact info download hoti hai.
          <br /><span style={{ color: 'var(--gold)' }}>Smart QR:</span> Info update karo → URL same → QR same → reprint nahi!
        </div>
        <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '9px 12px', border: '0.5px solid var(--brd)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'var(--gold)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vCardUrl}</span>
          <button onClick={() => { navigator.clipboard?.writeText(vCardUrl); toast('URL copied!') }} style={{ padding: '4px 10px', background: 'transparent', border: '0.5px solid var(--brd2)', borderRadius: 6, color: 'var(--tx)', fontSize: 11, cursor: 'pointer', flexShrink: 0 }}>Copy</button>
        </div>
        <div style={{ fontSize: 10, color: 'var(--mt)', marginTop: 8 }}>
          Test: Browser mein is URL ko open karo — vCard file auto-download honi chahiye.
        </div>
      </div>
    </div>
  )
}
