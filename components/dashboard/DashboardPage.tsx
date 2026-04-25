'use client'

import { useState, useCallback } from 'react'
import { CardPreview, CardFace } from '@/components/card/CardPreview'
import { User, CardDesign, QRData } from '@/types'
// dom-to-image-more is loaded dynamically inside downloadCardFace

interface DashboardPageProps {
    user: User
    qr: QRData
    vCardUrl: string
    onNavigate: (page: string) => void
    toast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

export function DashboardPage({ user, qr, vCardUrl, onNavigate, toast }: DashboardPageProps) {
    const [flipped, setFlipped] = useState(false)
    const total = (user.contactScans || 0) + (user.portfolioScans || 0)
    const [downloading, setDownloading] = useState(false)

    const downloadQR = (dataUrl: string, name: string) => {
        const a = document.createElement('a')
        a.download = `smartcard-${name}-qr.png`
        a.href = dataUrl
        a.click()
        toast(`${name} QR downloaded!`)
    }

    // Download card face as high-res PNG using dom-to-image-more
    const downloadCardFace = useCallback(async (side: 'front' | 'back' | 'both') => {
        setDownloading(true)
        try {
            const sides: ('front' | 'back')[] = side === 'both' ? ['front', 'back'] : [side]

            // Dynamic import dom-to-image-more (browser-only UMD module)
            const dtiModule = await import('dom-to-image-more')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const domtoimage = (dtiModule.default || dtiModule) as any

            // Pre-fetch Google Fonts CSS so we can inline it (avoids CORS SecurityError)
            let fontCSS = ''
            try {
                const fontUrl = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@300;400;600&family=Bebas+Neue&family=Josefin+Sans:wght@300;400;600&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400&family=Outfit:wght@300;400;500;600;700&display=swap'
                const resp = await fetch(fontUrl)
                fontCSS = await resp.text()
            } catch { /* font CSS fetch failed — continue without */ }

            for (const s of sides) {
                const PREVIEW_W = 350
                const PREVIEW_H = 220
                const SCALE = 3  // Output: 1050×660px (≈ 3.5"×2" at 300 DPI)

                // Create off-screen container
                const container = document.createElement('div')
                container.style.position = 'fixed'
                container.style.left = '0'
                container.style.top = '-9999px'
                container.style.width = `${PREVIEW_W}px`
                container.style.height = `${PREVIEW_H}px`
                container.style.overflow = 'hidden'
                container.style.borderRadius = '13px'
                container.style.zIndex = '9999'
                document.body.appendChild(container)

                // Inject Google Fonts CSS inline (same-origin → no CORS issues)
                if (fontCSS) {
                    const styleEl = document.createElement('style')
                    styleEl.textContent = fontCSS
                    container.appendChild(styleEl)
                }

                const { createRoot } = await import('react-dom/client')
                const root = createRoot(container)

                // Render card and wait for fonts + QR images to fully load
                await new Promise<void>((resolve) => {
                    root.render(
                        <CardFace
                            user={user}
                            design={user.cardDesign as CardDesign}
                            side={s}
                            qrContactDataUrl={qr.contact}
                            qrPortfolioDataUrl={qr.portfolio}
                        />
                    )
                    setTimeout(resolve, 2000)
                })

                // toBlob with filter to skip external <link> stylesheets (CORS fix)
                const blob: Blob = await domtoimage.toBlob(container, {
                    width: PREVIEW_W * SCALE,
                    height: PREVIEW_H * SCALE,
                    style: {
                        transform: `scale(${SCALE})`,
                        transformOrigin: 'top left',
                        width: `${PREVIEW_W}px`,
                        height: `${PREVIEW_H}px`,
                    },
                    bgcolor: '#0A0A0A',
                    cacheBust: true,
                    // Skip external stylesheet <link> nodes to avoid CORS SecurityError
                    filter: (node: Element) => {
                        if (node?.tagName === 'LINK' && node?.getAttribute?.('href')?.includes('fonts.googleapis')) {
                            return false
                        }
                        return true
                    },
                })

                // Blob → ObjectURL → download link (proper .png filename)
                const blobUrl = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.download = `smartcard-${s}-print.png`
                a.href = blobUrl
                a.style.display = 'none'
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                setTimeout(() => URL.revokeObjectURL(blobUrl), 2000)

                root.unmount()
                document.body.removeChild(container)

                if (sides.length > 1) await new Promise(r => setTimeout(r, 500))
            }

            toast(side === 'both' ? 'Front + Back cards downloaded!' : `${side} card downloaded!`, 'success')
        } catch (e) {
            console.error('Download error:', e)
            toast('Download failed — try again', 'error')
        } finally {
            setDownloading(false)
        }
    }, [user, qr, toast])

    const s: React.CSSProperties = { background: 'var(--bg2)', border: '0.5px solid var(--brd)', borderRadius: 10, padding: 14 }

    return (
        <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
                {[
                    { label: 'Contact Scans', value: user.contactScans || 0, color: 'var(--gold)', sub: 'QR → vCard saves' },
                    { label: 'Portfolio Views', value: user.portfolioScans || 0, color: 'var(--blue)', sub: 'QR → portfolio opens' },
                    { label: 'Total Scans', value: total, color: 'var(--tx)', sub: 'All time' },
                    { label: 'Your Slug', value: null, color: 'var(--gold)', sub: 'Unique card URL' },
                ].map((st, i) => (
                    <div key={i} style={s}>
                        <div style={{ fontSize: 11, color: 'var(--mt)', marginBottom: 4 }}>{st.label}</div>
                        {st.value !== null
                            ? <div style={{ fontSize: 26, fontWeight: 600, color: st.color, lineHeight: 1 }}>{st.value}</div>
                            : <div style={{ fontSize: 13, fontWeight: 600, color: st.color, fontFamily: "'DM Mono',monospace", marginTop: 4 }}>/{user.slug}</div>
                        }
                        <div style={{ fontSize: 10, color: 'var(--mt2)', marginTop: 3 }}>{st.sub}</div>
                    </div>
                ))}
            </div>

            {/* Card + QR grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {/* Card preview */}
                <div style={{ ...s, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Physical Card Preview</div>
                        <button onClick={() => setFlipped(f => !f)} style={{ padding: '4px 10px', background: 'transparent', border: '0.5px solid var(--brd2)', borderRadius: 6, color: 'var(--tx)', fontSize: 11, cursor: 'pointer' }}>Flip ↕</button>
                    </div>
                    <CardPreview user={user} design={user.cardDesign as CardDesign} qrContact={qr.contact} qrPortfolio={qr.portfolio} flipped={flipped} onFlip={() => setFlipped(f => !f)} />
                    <div style={{ display: 'flex', gap: 6, marginTop: 10, justifyContent: 'center' }}>
                        <button onClick={() => onNavigate('design')} style={{ padding: '6px 14px', background: 'transparent', border: '0.5px solid var(--brd2)', borderRadius: 7, color: 'var(--tx)', fontSize: 12, cursor: 'pointer' }}>Edit Design</button>
                        <button onClick={() => onNavigate('info')} style={{ padding: '6px 14px', background: 'linear-gradient(135deg,#C9A84C,#9A7A28)', borderRadius: 7, border: 'none', color: '#000', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Edit Info</button>
                    </div>

                    {/* Download card for print */}
                    <div style={{ marginTop: 12, background: 'var(--goldx)', border: '0.5px solid rgba(201,168,76,.2)', borderRadius: 8, padding: '10px 12px' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: 'var(--gold)' }}>⬇ Download Card for Print</div>
                        <div style={{ fontSize: 10, color: 'var(--mt)', marginBottom: 8 }}>High-resolution PNG (1050×662px — 3.5″×2″ at 300 DPI)</div>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <button
                                onClick={() => downloadCardFace('front')}
                                disabled={downloading}
                                style={{ flex: 1, padding: '7px 10px', background: 'transparent', border: '0.5px solid rgba(201,168,76,.4)', borderRadius: 7, color: 'var(--gold)', fontSize: 11, cursor: downloading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit,sans-serif' }}
                            >Front ↓</button>
                            <button
                                onClick={() => downloadCardFace('back')}
                                disabled={downloading}
                                style={{ flex: 1, padding: '7px 10px', background: 'transparent', border: '0.5px solid rgba(201,168,76,.4)', borderRadius: 7, color: 'var(--gold)', fontSize: 11, cursor: downloading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit,sans-serif' }}
                            >Back ↓</button>
                            <button
                                onClick={() => downloadCardFace('both')}
                                disabled={downloading}
                                style={{ flex: 1, padding: '7px 10px', background: 'linear-gradient(135deg,#C9A84C,#9A7A28)', border: 'none', borderRadius: 7, color: '#000', fontSize: 11, fontWeight: 600, cursor: downloading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit,sans-serif', opacity: downloading ? 0.7 : 1 }}
                            >{downloading ? 'Capturing...' : 'Both ↓'}</button>
                        </div>
                    </div>
                </div>

                {/* QR codes */}
                <div style={{ ...s, padding: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Your QR Codes</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, textAlign: 'center' }}>
                        {[
                            { label: 'Contact QR', url: qr.contact, name: 'contact', desc: 'Scan → saves contact' },
                            { label: 'Portfolio QR', url: qr.portfolio, name: 'portfolio', desc: 'Scan → opens portfolio' },
                        ].map(q => (
                            <div key={q.name}>
                                <div style={{ fontSize: 10, color: 'var(--mt)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: "'DM Mono',monospace" }}>{q.label}</div>
                                <div style={{ background: '#fff', borderRadius: 8, padding: 7, display: 'inline-flex', margin: '0 auto' }}>
                                    {q.url ? <img src={q.url} width={120} height={120} alt={q.label} /> : <div style={{ width: 120, height: 120, background: '#f0f0f0' }} />}
                                </div>
                                <div style={{ fontSize: 10, color: 'var(--mt)', marginTop: 5 }}>{q.desc}</div>
                                <button onClick={() => q.url && downloadQR(q.url, q.name)} style={{ marginTop: 6, padding: '4px 10px', background: 'transparent', border: '0.5px solid var(--brd2)', borderRadius: 6, color: 'var(--tx)', fontSize: 11, cursor: 'pointer' }}>Download PNG</button>
                            </div>
                        ))}
                    </div>
                    <div style={{ height: '0.5px', background: 'var(--brd)', margin: '14px 0' }} />
                    <div style={{ background: 'var(--goldx)', border: '0.5px solid rgba(201,168,76,.2)', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 500 }}>Print-ready files</div>
                            <div style={{ fontSize: 10, color: 'var(--mt)', marginTop: 2 }}>400×400px PNG format</div>
                        </div>
                        <button
                            onClick={() => { if (qr.contact) downloadQR(qr.contact, 'contact'); if (qr.portfolio) setTimeout(() => downloadQR(qr.portfolio, 'portfolio'), 400) }}
                            style={{ padding: '6px 12px', background: 'linear-gradient(135deg,#C9A84C,#9A7A28)', borderRadius: 7, border: 'none', color: '#000', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >Download Both ↓</button>
                    </div>

                    {/* QR Stability Notice */}
                    <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(46,204,113,.08)', border: '0.5px solid rgba(46,204,113,.2)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--grn)', marginBottom: 4 }}>✓ Smart QR — Update Without Reprinting</div>
                        <div style={{ fontSize: 10, color: 'var(--mt)', lineHeight: 1.5 }}>
                            Contact QR ab URL-based hai. Agar info update karte ho (phone, email, etc.), toh same printed QR se latest info milegi — reprint ki zaroorat nahi!
                        </div>
                    </div>
                </div>
            </div>

            {/* vCard URL */}
            <div style={{ ...s, marginTop: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Contact QR Link</div>
                <div style={{ fontSize: 11, color: 'var(--mt)', marginBottom: 10 }}>When someone scans your Contact QR, their phone downloads this vCard file and auto-saves your contact.</div>
                <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '9px 12px', border: '0.5px solid var(--brd)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'var(--gold)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vCardUrl}</span>
                    <button
                        onClick={() => { navigator.clipboard?.writeText(vCardUrl); toast('URL copied!') }}
                        style={{ padding: '4px 10px', background: 'transparent', border: '0.5px solid var(--brd2)', borderRadius: 6, color: 'var(--tx)', fontSize: 11, cursor: 'pointer', flexShrink: 0 }}
                    >Copy</button>
                </div>
            </div>
        </div>
    )
}
