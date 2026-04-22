'use client'

import { useState, useEffect } from 'react'
import { User, QRData } from '@/types'

interface QRTestPageProps {
  user: User
  qr: QRData
  vCardUrl: string
  token: string
  toast: (msg: string, type?: 'success'|'error'|'info') => void
}

export function QRTestPage({ user, qr, vCardUrl, token, toast }: QRTestPageProps) {
  const [testResult, setTestResult] = useState<'idle'|'loading'|'pass'|'fail'>('idle')
  const [vcardPreview, setVcardPreview] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [freshQr, setFreshQr] = useState<QRData>(qr)
  const [scanCounts, setScanCounts] = useState({ contact: user.contactScans||0, portfolio: user.portfolioScans||0 })

  // Build vCard string preview from user data
  useEffect(() => {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${user.name}`,
      `N:${user.name.split(' ').reverse().join(';')};;`,
      user.phone  ? `TEL;TYPE=CELL:${user.phone}`  : null,
      `EMAIL;TYPE=WORK:${user.email}`,
      user.company? `ORG:${user.company}`           : null,
      user.jobTitle?`TITLE:${user.jobTitle}`        : null,
      user.portfolioUrl?`URL:${user.portfolioUrl}`  : null,
      user.city   ? `ADR:;;${user.city};;;IN`       : null,
      user.linkedin?`X-SOCIALPROFILE;type=linkedin:${user.linkedin}`:null,
      user.github ? `X-SOCIALPROFILE;type=github:${user.github}`   :null,
      'END:VCARD',
    ].filter(Boolean).join('\r\n')
    setVcardPreview(lines)
  }, [user])

  const runTest = async () => {
    setTestResult('loading')
    try {
      const res = await fetch(vCardUrl, { method: 'GET' })
      if (res.ok && res.headers.get('content-type')?.includes('vcard')) {
        setTestResult('pass')
        toast('✓ vCard test passed — QR working correctly!', 'success')
      } else {
        setTestResult('fail')
        toast('QR URL returned unexpected response', 'error')
      }
    } catch {
      setTestResult('fail')
      toast('Could not reach vCard URL — check if server is running', 'error')
    }
  }

  const refreshQR = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/card/qr', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setFreshQr(data)
        toast('QR codes refreshed!', 'success')
      }
    } catch { toast('Refresh failed', 'error') }
    setRefreshing(false)
  }

  const downloadQR = (dataUrl: string, name: string) => {
    if (!dataUrl) { toast('QR not available', 'error'); return }
    const a = document.createElement('a')
    a.download = `smartcard-${name}-qr-400px.png`
    a.href = dataUrl
    a.click()
    toast(`${name} QR downloaded (400×400px)`)
  }

  const statusColor = { idle:'var(--mt)', loading:'var(--blue)', pass:'var(--grn)', fail:'var(--red)' }[testResult]
  const statusText  = { idle:'Test nahi chala', loading:'Testing...', pass:'✓ Working perfectly', fail:'✕ Issue detected' }[testResult]

  const card = { background: 'var(--bg2)', border: '0.5px solid var(--brd)', borderRadius: 11, padding: 16 }

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>QR System Test</div>
        <div style={{ fontSize: 12, color: 'var(--mt)' }}>Verify karo ki dono QR codes properly kaam kar rahe hain aur correct data encode ho raha hai</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Contact QR */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
            <div style={{ fontSize: 13, fontWeight: 600 }}>Contact QR (Front of Card)</div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div style={{ background: '#fff', borderRadius: 10, padding: 10, display: 'inline-flex' }}>
              {freshQr.contact
                ? <img src={freshQr.contact} width={160} height={160} alt="Contact QR" />
                : <div style={{ width:160, height:160, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#999' }}>No QR</div>
              }
            </div>
          </div>
          <div style={{ background: 'var(--bg3)', borderRadius: 7, padding: '8px 10px', marginBottom: 10, fontSize: 11, color: 'var(--mt)', fontFamily: "'DM Mono',monospace", wordBreak: 'break-all' }}>
            <div style={{ color: 'var(--gold)', marginBottom: 3, fontSize: 10 }}>Target URL:</div>
            {vCardUrl}
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <button onClick={runTest} disabled={testResult==='loading'} style={{ flex:1, padding:'7px 10px', background:'linear-gradient(135deg,#C9A84C,#9A7A28)', border:'none', borderRadius:7, color:'#000', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'Outfit,sans-serif' }}>
              {testResult==='loading' ? 'Testing...' : 'Test vCard URL'}
            </button>
            <button onClick={() => downloadQR(freshQr.contact, 'contact')} style={{ padding:'7px 10px', background:'transparent', border:'0.5px solid var(--brd2)', borderRadius:7, color:'var(--tx)', fontSize:11, cursor:'pointer' }}>
              ↓ Download
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', background: `${statusColor}18`, border: `0.5px solid ${statusColor}44`, borderRadius: 7 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor }} />
            <span style={{ fontSize: 11, color: statusColor, fontWeight: 500 }}>{statusText}</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: 'var(--mt)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--tx)' }}>Scan kaise kaam karta hai:</strong><br/>
            Phone camera → QR scan → URL open hoti hai → .vcf file download hoti hai → Phone "Add Contact" prompt dikhata hai → Contact save!
          </div>
        </div>

        {/* Portfolio QR */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)' }} />
            <div style={{ fontSize: 13, fontWeight: 600 }}>Portfolio QR (Back of Card)</div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div style={{ background: '#fff', borderRadius: 10, padding: 10, display: 'inline-flex' }}>
              {freshQr.portfolio
                ? <img src={freshQr.portfolio} width={160} height={160} alt="Portfolio QR" />
                : <div style={{ width:160, height:160, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#999' }}>No QR</div>
              }
            </div>
          </div>
          <div style={{ background: 'var(--bg3)', borderRadius: 7, padding: '8px 10px', marginBottom: 10, fontSize: 11, color: 'var(--mt)', fontFamily: "'DM Mono',monospace", wordBreak: 'break-all' }}>
            <div style={{ color: 'var(--blue)', marginBottom: 3, fontSize: 10 }}>Target URL:</div>
            {user.portfolioUrl || '(Portfolio URL set nahi hai — Card Info mein add karo)'}
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <a href={user.portfolioUrl||'#'} target="_blank" rel="noreferrer"
              style={{ flex:1, padding:'7px 10px', background:'linear-gradient(135deg,#3B8BD4,#1A5FA0)', border:'none', borderRadius:7, color:'#fff', fontSize:11, fontWeight:600, cursor:'pointer', textAlign:'center', textDecoration:'none', display:'block' }}>
              Portfolio Test ↗
            </a>
            <button onClick={() => downloadQR(freshQr.portfolio, 'portfolio')} style={{ padding:'7px 10px', background:'transparent', border:'0.5px solid var(--brd2)', borderRadius:7, color:'var(--tx)', fontSize:11, cursor:'pointer' }}>
              ↓ Download
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', background: user.portfolioUrl?'rgba(46,204,113,.12)':'rgba(231,76,60,.12)', border: `0.5px solid ${user.portfolioUrl?'rgba(46,204,113,.25)':'rgba(231,76,60,.25)'}`, borderRadius: 7 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: user.portfolioUrl?'var(--grn)':'var(--red)' }} />
            <span style={{ fontSize: 11, color: user.portfolioUrl?'var(--grn)':'var(--red)', fontWeight: 500 }}>
              {user.portfolioUrl ? '✓ Portfolio URL set hai' : '✕ Portfolio URL missing — Card Info mein add karo'}
            </span>
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: 'var(--mt)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--tx)' }}>Kaise kaam karta hai:</strong><br/>
            Phone camera → QR scan → Browser mein portfolio URL directly open hoti hai → Visitor projects dekh sakta hai!
          </div>
        </div>
      </div>

      {/* vCard Preview */}
      <div style={{ ...card, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>vCard Data Preview</div>
            <div style={{ fontSize: 11, color: 'var(--mt)', marginTop: 2 }}>Ye exact data Contact QR mein encode hota hai — phone isi ko read karke contact save karta hai</div>
          </div>
          <button onClick={refreshQR} disabled={refreshing} style={{ padding:'6px 12px', background:'transparent', border:'0.5px solid var(--brd2)', borderRadius:7, color:'var(--tx)', fontSize:11, cursor:'pointer', flexShrink:0 }}>
            {refreshing ? 'Refreshing...' : '↻ Refresh QRs'}
          </button>
        </div>
        <div style={{ background: '#0d0d0d', borderRadius: 8, padding: 14, border: '0.5px solid rgba(201,168,76,.2)', overflowX: 'auto' }}>
          <pre style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, lineHeight: 1.8, color: '#c9c9c9', margin: 0, whiteSpace: 'pre-wrap' }}>
            {vcardPreview.split('\r\n').map((line, i) => {
              const isKey = line.includes(':')
              const [key, ...val] = line.split(':')
              return (
                <div key={i}>
                  {isKey && val.length
                    ? <><span style={{ color: '#C9A84C' }}>{key}</span><span style={{ color: '#666' }}>:</span><span style={{ color: '#9fca78' }}>{val.join(':')}</span></>
                    : <span style={{ color: '#888' }}>{line}</span>
                  }
                </div>
              )
            })}
          </pre>
        </div>
        <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(201,168,76,.08)', borderRadius: 7, border: '0.5px solid rgba(201,168,76,.2)', fontSize: 11, color: 'var(--mt)' }}>
          <strong style={{ color: 'var(--gold)' }}>Tip:</strong> Agar info change ki hai toh "Refresh QRs" dabao — QR codes fresh data se regenerate ho jaayenge. Card Info save karne par bhi auto-refresh hota hai.
        </div>
      </div>

      {/* Scan stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'Contact Scans', val: scanCounts.contact,   color: 'var(--gold)', desc: 'Total vCard saves' },
          { label: 'Portfolio Scans', val: scanCounts.portfolio, color: 'var(--blue)', desc: 'Total portfolio opens' },
          { label: 'Total',          val: scanCounts.contact + scanCounts.portfolio, color: 'var(--tx)', desc: 'Combined scans' },
        ].map(s => (
          <div key={s.label} style={card}>
            <div style={{ fontSize: 11, color: 'var(--mt)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 10, color: 'var(--mt2)', marginTop: 4 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Troubleshoot */}
      <div style={{ ...card, marginTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Troubleshooting</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { prob: 'QR scan karne par kuch nahi hota', sol: 'Phone ka default camera app use karo, QR scanner third party mat use karo' },
            { prob: 'Contact save nahi ho raha', sol: 'iOS mein Settings → Camera → Scan QR Codes ON karo. Android mein Google Lens try karo' },
            { prob: 'Contact save hua lekin info galat hai', sol: 'Card Info mein sahi info update karo aur Refresh QRs karo' },
            { prob: 'Portfolio QR nahi khul raha', sol: 'Card Info mein portfolioUrl sahi format mein daalo: https:// se shuru honi chahiye' },
            { prob: 'QR blurry print hua', sol: 'Dashboard se 400px PNG download karo, Figma mein 300 DPI pe export karo' },
            { prob: 'vCard mein naam galat aa raha hai', sol: 'Card Info → Full Name update karo → Save → Refresh QRs' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '10px 12px', background: 'var(--bg3)', borderRadius: 8, border: '0.5px solid var(--brd)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--red)', marginBottom: 4 }}>✕ {item.prob}</div>
              <div style={{ fontSize: 11, color: 'var(--mt)', lineHeight: 1.5 }}>→ {item.sol}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
