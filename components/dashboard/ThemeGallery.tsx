'use client'

import { useState, useMemo } from 'react'
import { CardFace } from '@/components/card/CardPreview'
import { TEMPLATES, CATEGORY_LABELS, FONTS } from '@/lib/cardConstants'
import { User, CardDesign } from '@/types'

interface ThemeGalleryProps {
  user: User
  currentDesign: Partial<CardDesign>
  onSelectTheme: (templateKey: string, design: Partial<CardDesign>) => void
  toast: (msg: string) => void
}

export function ThemeGallery({ user, currentDesign, onSelectTheme, toast }: ThemeGalleryProps) {
  const [category, setCategory] = useState('all')
  const [hoveredKey, setHoveredKey] = useState<string|null>(null)
  const [selectedKey, setSelectedKey] = useState<string>(currentDesign.template || 'executive')
  const [previewFlipped, setPreviewFlipped] = useState(false)

  const filtered = useMemo(() => {
    return Object.entries(TEMPLATES).filter(([, t]) =>
      category === 'all' || t.category === category
    )
  }, [category])

  const applyTheme = (key: string) => {
    const t = TEMPLATES[key]
    if (!t) return
    const design: Partial<CardDesign> = {
      template:       key,
      bgColor:        t.bgColor,
      bgColor2:       t.bgColor2,
      accentColor:    t.accentColor,
      textColor:      t.textColor,
      subtextColor:   t.subtextColor,
      showCornerDeco: t.showCornerDeco,
      showGoldLine:   t.showGoldLine,
      frontLayout:    t.frontLayout,
      qrPosition:     t.qrPosition,
      fontFamily:     t.fontFamily,
      showTagline:    t.showTagline,
    }
    setSelectedKey(key)
    onSelectTheme(key, design)
    toast(`✓ Theme "${t.label}" applied — save karo Design tab mein`)
  }

  const selectedTmpl = TEMPLATES[selectedKey]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx)', marginBottom: 4 }}>Theme Gallery</div>
        <div style={{ fontSize: 12, color: 'var(--mt)' }}>
          Uploaded references se inspired 12 premium themes — select karo, preview dekho, apply karo
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Left — gallery */}
        <div>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                  background: category === key ? 'var(--gold)' : 'var(--bg3)',
                  color: category === key ? '#000' : 'var(--mt)',
                  border: category === key ? 'none' : '0.5px solid var(--brd)',
                  transition: 'all .15s',
                }}
              >{label}</button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {filtered.map(([key, tmpl]) => {
              const isSelected = selectedKey === key
              const isHovered = hoveredKey === key
              const previewDesign: Partial<CardDesign> = {
                template: key, bgColor: tmpl.bgColor, bgColor2: tmpl.bgColor2,
                accentColor: tmpl.accentColor, textColor: tmpl.textColor,
                subtextColor: tmpl.subtextColor, showCornerDeco: tmpl.showCornerDeco,
                showGoldLine: tmpl.showGoldLine, frontLayout: tmpl.frontLayout,
                qrPosition: tmpl.qrPosition, fontFamily: tmpl.fontFamily,
                showTagline: tmpl.showTagline, tagline: 'Building Scalable Web Apps',
              }
              return (
                <div
                  key={key}
                  onMouseEnter={() => setHoveredKey(key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onClick={() => applyTheme(key)}
                  style={{
                    borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                    border: `2px solid ${isSelected ? 'var(--gold)' : isHovered ? 'var(--brd2)' : 'transparent'}`,
                    transition: 'all .2s',
                    transform: isHovered && !isSelected ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 0 3px rgba(201,168,76,.3)' : 'none',
                  }}
                >
                  {/* Mini card preview */}
                  <div style={{ aspectRatio: '1.586/1', position: 'relative' }}>
                    <CardFace user={user} design={previewDesign} side="front" />
                    {isSelected && (
                      <div style={{ position: 'absolute', top: 6, left: 6, background: 'var(--gold)', borderRadius: 4, padding: '2px 6px', fontSize: 9, fontWeight: 700, color: '#000' }}>✓ Active</div>
                    )}
                  </div>
                  {/* Label */}
                  <div style={{ padding: '8px 10px', background: 'var(--bg3)', borderTop: '0.5px solid var(--brd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>{tmpl.label}</div>
                      <div style={{ fontSize: 9, color: 'var(--mt)', textTransform: 'capitalize' }}>{tmpl.category}</div>
                    </div>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: tmpl.accentColor, border: '1px solid rgba(255,255,255,.2)', flexShrink: 0 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right — selected theme details + big preview */}
        <div>
          <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--brd)', borderRadius: 12, padding: 16, position: 'sticky', top: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', marginBottom: 12 }}>
              {selectedTmpl ? `${selectedTmpl.label} — Preview` : 'Select a theme'}
            </div>

            {/* Big card preview */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ aspectRatio: '1.586/1', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 8px 30px rgba(0,0,0,.5)' }} onClick={() => setPreviewFlipped(f => !f)}>
                <CardFace
                  user={user}
                  design={{
                    template: selectedKey,
                    bgColor: selectedTmpl?.bgColor,
                    bgColor2: selectedTmpl?.bgColor2,
                    accentColor: selectedTmpl?.accentColor,
                    textColor: selectedTmpl?.textColor,
                    subtextColor: selectedTmpl?.subtextColor,
                    showCornerDeco: selectedTmpl?.showCornerDeco,
                    showGoldLine: selectedTmpl?.showGoldLine,
                    frontLayout: selectedTmpl?.frontLayout,
                    qrPosition: selectedTmpl?.qrPosition,
                    fontFamily: selectedTmpl?.fontFamily,
                    showTagline: selectedTmpl?.showTagline,
                    tagline: 'Building Scalable Web Apps',
                  }}
                  side={previewFlipped ? 'back' : 'front'}
                />
              </div>
              <div style={{ textAlign: 'center', marginTop: 6, fontSize: 10, color: 'var(--mt)' }}>Click to flip ↕</div>
            </div>

            {/* Theme info */}
            {selectedTmpl && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {[
                    { label: 'Font', val: FONTS[selectedTmpl.fontFamily]?.label || selectedTmpl.fontFamily },
                    { label: 'Style', val: selectedTmpl.category },
                    { label: 'Layout', val: selectedTmpl.frontLayout.replace('name-','') },
                  ].map(i => (
                    <div key={i.label} style={{ background: 'var(--bg3)', borderRadius: 6, padding: '4px 8px', fontSize: 10 }}>
                      <span style={{ color: 'var(--mt)' }}>{i.label}: </span>
                      <span style={{ color: 'var(--tx)', textTransform: 'capitalize' }}>{i.val}</span>
                    </div>
                  ))}
                </div>
                {/* Color swatches */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {[selectedTmpl.bgColor, selectedTmpl.bgColor2, selectedTmpl.accentColor, selectedTmpl.textColor].map((c, i) => (
                    <div key={i} title={c} style={{ width: 20, height: 20, borderRadius: 4, background: c, border: '1px solid rgba(255,255,255,.15)', flexShrink: 0 }} />
                  ))}
                  <span style={{ fontSize: 10, color: 'var(--mt)', marginLeft: 4 }}>Color palette</span>
                </div>
              </div>
            )}

            <button
              onClick={() => selectedTmpl && applyTheme(selectedKey)}
              style={{
                width: '100%', padding: '10px', borderRadius: 9, border: 'none',
                background: 'linear-gradient(135deg,#C9A84C,#9A7A28)',
                color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              Apply "{selectedTmpl?.label}" Theme
            </button>
            <div style={{ fontSize: 10, color: 'var(--mt)', textAlign: 'center', marginTop: 8 }}>
              Apply ke baad Design tab mein aur customize kar sakte ho
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
