'use client'

import { useState, useCallback } from 'react'
import { CardPreview, CardFace } from '@/components/card/CardPreview'
import { User, CardDesign, QRData } from '@/types'
import { TEMPLATES, FONTS, DEFAULT_DESIGN } from '@/lib/cardConstants'
// dom-to-image-more is loaded dynamically inside downloadCard

interface DesignPageProps {
  user: User
  qr: QRData
  token: string
  onSave: (design: CardDesign) => void
  toast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

export function DesignPage({ user, qr, token, onSave, toast }: DesignPageProps) {
  const [design, setDesign] = useState<CardDesign>({ ...DEFAULT_DESIGN, ...(user.cardDesign || {}) })
  const [saving, setSaving] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const upd = (key: keyof CardDesign, val: unknown) => setDesign(d => ({ ...d, [key]: val }))

  const applyTemplate = (key: keyof typeof TEMPLATES) => {
    const t = TEMPLATES[key]
    setDesign(d => ({ ...d, ...t, template: key }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/card/design', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(design),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onSave(design)
      toast('Design saved!')
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Download card as high-quality print-ready PDF (3.5×2" at 300 DPI)
  const downloadCard = useCallback(async (side: 'front' | 'back' | 'both') => {
    setDownloading(true)
    try {
      const sides: ('front' | 'back')[] = side === 'both' ? ['front', 'back'] : [side]

      // Dynamic imports
      const dtiModule = await import('dom-to-image-more')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const domtoimage = (dtiModule.default || dtiModule) as any
      const { jsPDF } = await import('jspdf')

      // Pre-fetch Google Fonts CSS to inline (avoids CORS SecurityError)
      let fontCSS = ''
      try {
        const fontUrl = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@300;400;600&family=Bebas+Neue&family=Josefin+Sans:wght@300;400;600&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400&family=Outfit:wght@300;400;500;600;700&display=swap'
        const resp = await fetch(fontUrl)
        fontCSS = await resp.text()
      } catch { /* continue without fonts */ }

      // Standard business card: 3.5" × 2" — landscape
      const CARD_W_IN = 3.5
      const CARD_H_IN = 2
      // Create PDF in landscape with exact card dimensions (inches)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [CARD_W_IN, CARD_H_IN],
      })

      for (let i = 0; i < sides.length; i++) {
        const s = sides[i]

        // Add new page for subsequent sides
        if (i > 0) pdf.addPage([CARD_W_IN, CARD_H_IN], 'landscape')

        // Render at high DPI for print quality (300 DPI → 1050×600 pixels)
        const PREVIEW_W = 350
        const PREVIEW_H = 200
        const SCALE = 3  // 350×3 = 1050px wide ≈ 300 DPI at 3.5"

        const container = document.createElement('div')
        container.style.position = 'fixed'
        container.style.left = '0'
        container.style.top = '-9999px'
        container.style.width = `${PREVIEW_W}px`
        container.style.height = `${PREVIEW_H}px`
        container.style.overflow = 'hidden'
        container.style.borderRadius = '0px'  // No radius for print
        container.style.zIndex = '9999'
        document.body.appendChild(container)

        // Inject Google Fonts CSS inline (same-origin → no CORS)
        if (fontCSS) {
          const styleEl = document.createElement('style')
          styleEl.textContent = fontCSS
          container.appendChild(styleEl)
        }

        const { createRoot } = await import('react-dom/client')
        const root = createRoot(container)

        await new Promise<void>((resolve) => {
          root.render(
            <CardFace
              user={user}
              design={design}
              side={s}
              qrContactDataUrl={qr.contact}
              qrPortfolioDataUrl={qr.portfolio}
            />
          )
          setTimeout(resolve, 2000)
        })

        // Capture as high-res PNG data URL
        const dataUrl: string = await domtoimage.toPng(container, {
          width:  PREVIEW_W * SCALE,
          height: PREVIEW_H * SCALE,
          style: {
            transform: `scale(${SCALE})`,
            transformOrigin: 'top left',
            width:  `${PREVIEW_W}px`,
            height: `${PREVIEW_H}px`,
          },
          bgcolor: '#0A0A0A',
          cacheBust: true,
          filter: (node: Element) => {
            if (node?.tagName === 'LINK' && node?.getAttribute?.('href')?.includes('fonts.googleapis')) {
              return false
            }
            return true
          },
        })

        // Embed the captured image into the PDF page, filling entire page
        pdf.addImage(dataUrl, 'PNG', 0, 0, CARD_W_IN, CARD_H_IN, undefined, 'FAST')

        root.unmount()
        document.body.removeChild(container)
      }

      // Save the PDF
      const fileName = side === 'both'
        ? 'smartcard-front-back-print.pdf'
        : `smartcard-${side}-print.pdf`
      pdf.save(fileName)

      toast(
        side === 'both'
          ? 'Front + Back PDF downloaded — print-ready!'
          : `${side.charAt(0).toUpperCase() + side.slice(1)} card PDF downloaded!`,
        'success'
      )
    } catch (e) {
      console.error('Download error:', e)
      toast('Download failed — try again', 'error')
    } finally {
      setDownloading(false)
    }
  }, [user, design, qr, toast])

  const card = { background: 'var(--bg2)', border: '0.5px solid var(--brd)', borderRadius: 11, padding: 16, marginBottom: 14 }

  const ColorRow = ({ label, field }: { label: string; field: keyof CardDesign }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
      <label style={{ fontSize: 10, fontWeight: 500, color: 'var(--mt)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 6, background: design[field] as string, border: '0.5px solid var(--brd2)', flexShrink: 0, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
          <input type="color" value={design[field] as string} onChange={e => upd(field, e.target.value)} style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
        </div>
        <input
          value={design[field] as string}
          onChange={e => { if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) upd(field, e.target.value) }}
          placeholder="#000000"
          style={{ background: 'var(--bg3)', border: '0.5px solid var(--brd)', borderRadius: 7, padding: '7px 11px', color: 'var(--tx)', fontSize: 12, outline: 'none', flex: 1 }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--brd)'}
        />
      </div>
    </div>
  )

  const Toggle = ({ label, field }: { label: string; field: keyof CardDesign }) => {
    const checked = design[field] as boolean
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
        <span style={{ fontSize: 12, color: 'var(--tx)' }}>{label}</span>
        <div onClick={() => upd(field, !checked)} style={{ width: 34, height: 19, borderRadius: 10, background: checked ? 'var(--gold)' : 'var(--bg4)', position: 'relative', cursor: 'pointer', transition: 'background .2s', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 2.5, left: checked ? 17 : 2.5, width: 14, height: 14, background: '#fff', borderRadius: '50%', transition: 'left .2s' }} />
        </div>
      </div>
    )
  }

  const Select = ({ label, field, opts }: { label: string; field: keyof CardDesign; opts: { value: string; label: string }[] }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
      <label style={{ fontSize: 10, fontWeight: 500, color: 'var(--mt)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</label>
      <select
        value={design[field] as string}
        onChange={e => upd(field, e.target.value)}
        style={{ background: 'var(--bg3)', border: '0.5px solid var(--brd)', borderRadius: 7, padding: '8px 11px', color: 'var(--tx)', fontSize: 12, outline: 'none', width: '100%', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 28 }}
      >
        {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <div>
        {/* Templates */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Quick Templates</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {Object.entries(TEMPLATES).map(([key, t]) => (
              <div
                key={key}
                onClick={() => applyTemplate(key as keyof typeof TEMPLATES)}
                style={{
                  aspectRatio: '1.586/1', borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
                  border: `2px solid ${design.template === key ? 'var(--gold)' : 'transparent'}`,
                  transition: 'border-color .15s, transform .15s', position: 'relative',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
              >
                <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg,${t.bgColor},${t.bgColor2})`, padding: 8, position: 'relative' }}>
                  <div style={{ fontSize: 7, fontWeight: 700, color: t.textColor, opacity: .9 }}>{t.label}</div>
                  <div style={{ position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, background: '#fff', borderRadius: 2, opacity: .9 }} />
                  <div style={{ position: 'absolute', bottom: 5, left: 7, width: 2, height: 2, borderRadius: '50%', background: t.accentColor }} />
                </div>
                <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center', fontSize: 8, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Colors</div>
          <ColorRow label="Background 1"         field="bgColor"       />
          <ColorRow label="Background 2"         field="bgColor2"      />
          <ColorRow label="Accent / Highlight"   field="accentColor"   />
          <ColorRow label="Main Text"            field="textColor"     />
          <ColorRow label="Subtext"              field="subtextColor"  />
        </div>

        {/* Font */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Typography</div>
          <Select label="Name Font" field="fontFamily" opts={Object.entries(FONTS).map(([k, f]) => ({ value: k, label: f.label }))} />
        </div>
      </div>

      <div>
        {/* Layout */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Layout Options</div>
          <Select label="Name Alignment" field="frontLayout" opts={[
            { value: 'name-left',   label: 'Left'   },
            { value: 'name-center', label: 'Center' },
            { value: 'name-right',  label: 'Right'  },
          ]} />
          <Select label="QR Code Position" field="qrPosition" opts={[
            { value: 'bottom-right', label: 'Bottom Right' },
            { value: 'bottom-left',  label: 'Bottom Left'  },
            { value: 'top-right',    label: 'Top Right'    },
          ]} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
            <label style={{ fontSize: 10, fontWeight: 500, color: 'var(--mt)', letterSpacing: '.06em', textTransform: 'uppercase' }}>Tagline Text</label>
            <input
              value={design.tagline}
              onChange={e => upd('tagline', e.target.value)}
              placeholder="Turning Your Ideas into Scalable Digital Products"
              style={{ background: 'var(--bg3)', border: '0.5px solid var(--brd)', borderRadius: 7, padding: '8px 11px', color: 'var(--tx)', fontSize: 12, outline: 'none' }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--brd)'}
            />
          </div>

          <div style={{ marginTop: 4 }}>
            <Toggle label="Corner Decorations"  field="showCornerDeco" />
            <Toggle label="Accent / Gold Line"  field="showGoldLine"   />
            <Toggle label="Show Tagline"         field="showTagline"    />
          </div>
        </div>

        {/* Live preview */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Live Preview</div>
            <button onClick={() => setFlipped(f => !f)} style={{ padding: '4px 10px', background: 'transparent', border: '0.5px solid var(--brd2)', borderRadius: 6, color: 'var(--tx)', fontSize: 11, cursor: 'pointer' }}>Flip ↕</button>
          </div>
          <CardPreview user={user} design={design} qrContact={qr.contact} qrPortfolio={qr.portfolio} flipped={flipped} onFlip={() => setFlipped(f => !f)} />
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ width: '100%', marginTop: 14, padding: 11, background: 'linear-gradient(135deg,#C9A84C,#9A7A28)', borderRadius: 10, border: 'none', color: '#000', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}
          >
            {saving ? 'Saving...' : 'Save Design'}
          </button>

          {/* Download for Print button */}
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <button
              onClick={() => downloadCard('front')}
              disabled={downloading}
              style={{ flex: 1, padding: '8px', background: 'transparent', border: '0.5px solid var(--brd2)', borderRadius: 7, color: 'var(--tx)', fontSize: 11, cursor: downloading ? 'not-allowed' : 'pointer' }}
            >↓ Front PDF</button>
            <button
              onClick={() => downloadCard('back')}
              disabled={downloading}
              style={{ flex: 1, padding: '8px', background: 'transparent', border: '0.5px solid var(--brd2)', borderRadius: 7, color: 'var(--tx)', fontSize: 11, cursor: downloading ? 'not-allowed' : 'pointer' }}
            >↓ Back PDF</button>
            <button
              onClick={() => downloadCard('both')}
              disabled={downloading}
              style={{ flex: 1, padding: '8px', background: 'var(--goldx)', border: '0.5px solid rgba(201,168,76,.3)', borderRadius: 7, color: 'var(--gold)', fontSize: 11, fontWeight: 600, cursor: downloading ? 'not-allowed' : 'pointer' }}
            >{downloading ? 'Generating PDF...' : '↓ Both PDF'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
