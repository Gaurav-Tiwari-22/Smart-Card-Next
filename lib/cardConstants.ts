// ─────────────────────────────────────────────────────────────────
// TEMPLATES — inspired by uploaded Freepik references + custom
// Each has front + back design tokens
// ─────────────────────────────────────────────────────────────────

export interface TemplateConfig {
  label:          string
  category:       'dark' | 'light' | 'colorful' | 'minimal' | 'professional'
  preview:        string        // emoji used in gallery
  bgColor:        string
  bgColor2:       string
  accentColor:    string
  textColor:      string
  subtextColor:   string
  showCornerDeco: boolean
  showGoldLine:   boolean
  frontLayout:    'name-left' | 'name-center' | 'name-right'
  qrPosition:     'bottom-right' | 'bottom-left' | 'top-right'
  fontFamily:     keyof typeof FONTS
  showTagline:    boolean
  // unique design elements
  style:          'classic' | 'split' | 'diagonal' | 'modern' | 'bubble' | 'geometric' | 'professional'
}

export const TEMPLATES: Record<string, TemplateConfig> = {
  // ── Uploaded reference 1: JimmyBrook — dark navy + gold ───────
  jimmybrook: {
    label:'JimmyBrook', category:'dark', preview:'◆',
    bgColor:'#1B1F3B', bgColor2:'#2D325A', accentColor:'#C9A84C',
    textColor:'#FFFFFF', subtextColor:'#C4BBDD',
    showCornerDeco:false, showGoldLine:true, frontLayout:'name-left',
    qrPosition:'top-right', fontFamily:'playfair',
    showTagline:true, style:'split',
  },
  // ── Uploaded reference 2: BlueCorp — deep blue + geometric ────
  bluecorp: {
    label:'BlueCorp', category:'colorful', preview:'▦',
    bgColor:'#1565C0', bgColor2:'#0D47A1', accentColor:'#29B6F6',
    textColor:'#FFFFFF', subtextColor:'#B3E5FC',
    showCornerDeco:false, showGoldLine:false, frontLayout:'name-left',
    qrPosition:'bottom-right', fontFamily:'josefin',
    showTagline:true, style:'geometric',
  },
  // ── Uploaded reference 3: AquaClean — white + teal bubbles ────
  aquaclean: {
    label:'AquaClean', category:'light', preview:'◎',
    bgColor:'#FFFFFF', bgColor2:'#F0FDFA', accentColor:'#0F766E',
    textColor:'#0F172A', subtextColor:'#475569',
    showCornerDeco:false, showGoldLine:false, frontLayout:'name-left',
    qrPosition:'bottom-left', fontFamily:'josefin',
    showTagline:false, style:'bubble',
  },
  // ── Dark Executive — original gold ────────────────────────────
  executive: {
    label:'Executive', category:'dark', preview:'▣',
    bgColor:'#0A0A0A', bgColor2:'#1a1410', accentColor:'#C9A84C',
    textColor:'#FFFFFF', subtextColor:'#888884',
    showCornerDeco:true, showGoldLine:true, frontLayout:'name-left',
    qrPosition:'bottom-right', fontFamily:'playfair',
    showTagline:true, style:'classic',
  },
  // ── Minimal White ─────────────────────────────────────────────
  minimal: {
    label:'Minimal', category:'minimal', preview:'□',
    bgColor:'#F8F7F2', bgColor2:'#EEEDE6', accentColor:'#1A1A1A',
    textColor:'#0A0A0A', subtextColor:'#666666',
    showCornerDeco:false, showGoldLine:false, frontLayout:'name-center',
    qrPosition:'bottom-right', fontFamily:'josefin',
    showTagline:false, style:'modern',
  },
  // ── Bold Tech Blue ────────────────────────────────────────────
  boldtech: {
    label:'Bold Tech', category:'dark', preview:'◈',
    bgColor:'#0F1923', bgColor2:'#162435', accentColor:'#3B8BD4',
    textColor:'#FFFFFF', subtextColor:'#6A9FCA',
    showCornerDeco:false, showGoldLine:true, frontLayout:'name-left',
    qrPosition:'bottom-right', fontFamily:'bebas',
    showTagline:true, style:'diagonal',
  },
  // ── Purple Glass ──────────────────────────────────────────────
  purpleglass: {
    label:'Purple Glass', category:'dark', preview:'◉',
    bgColor:'#1A0A2E', bgColor2:'#2D1545', accentColor:'#A855F7',
    textColor:'#FFFFFF', subtextColor:'#C084FC',
    showCornerDeco:true, showGoldLine:false, frontLayout:'name-center',
    qrPosition:'bottom-right', fontFamily:'cormorant',
    showTagline:true, style:'classic',
  },
  // ── Neon Terminal ─────────────────────────────────────────────
  neon: {
    label:'Neon', category:'dark', preview:'▷',
    bgColor:'#050A0A', bgColor2:'#071414', accentColor:'#00FFB2',
    textColor:'#FFFFFF', subtextColor:'#00CC8E',
    showCornerDeco:false, showGoldLine:true, frontLayout:'name-left',
    qrPosition:'bottom-right', fontFamily:'bebas',
    showTagline:true, style:'modern',
  },
  // ── Orange Editorial ──────────────────────────────────────────
  editorial: {
    label:'Editorial', category:'dark', preview:'◐',
    bgColor:'#1C1917', bgColor2:'#292524', accentColor:'#F97316',
    textColor:'#FAFAF8', subtextColor:'#A8A29E',
    showCornerDeco:true, showGoldLine:false, frontLayout:'name-left',
    qrPosition:'bottom-right', fontFamily:'dmSerif',
    showTagline:false, style:'split',
  },
  // ── Rose Gold ─────────────────────────────────────────────────
  rosegold: {
    label:'Rose Gold', category:'light', preview:'◇',
    bgColor:'#FDF2F8', bgColor2:'#FCE7F3', accentColor:'#BE185D',
    textColor:'#1F0A14', subtextColor:'#9D174D',
    showCornerDeco:true, showGoldLine:true, frontLayout:'name-center',
    qrPosition:'bottom-right', fontFamily:'cormorant',
    showTagline:true, style:'classic',
  },
  // ── Midnight Green ────────────────────────────────────────────
  midnightgreen: {
    label:'Midnight Green', category:'dark', preview:'◑',
    bgColor:'#052E16', bgColor2:'#14532D', accentColor:'#4ADE80',
    textColor:'#FFFFFF', subtextColor:'#86EFAC',
    showCornerDeco:false, showGoldLine:false, frontLayout:'name-left',
    qrPosition:'bottom-right', fontFamily:'josefin',
    showTagline:true, style:'geometric',
  },
  // ── Crimson ───────────────────────────────────────────────────
  crimson: {
    label:'Crimson', category:'colorful', preview:'◆',

    bgColor:'#450A0A', bgColor2:'#7F1D1D', accentColor:'#FCA5A5',
    textColor:'#FFFFFF', subtextColor:'#FCA5A5',
    showCornerDeco:true, showGoldLine:false, frontLayout:'name-left',
    qrPosition:'top-right', fontFamily:'playfair',
    showTagline:true, style:'diagonal',
  },
  // ══════════════════════════════════════════════════════════════
  // PROFESSIONAL THEMES — Vistaprint/Freepik inspired
  // ══════════════════════════════════════════════════════════════
  aviatored: {
    label:'Aviato Red', category:'professional', preview:'▬',
    bgColor:'#FFFFFF', bgColor2:'#F8F8F6', accentColor:'#D32F2F',
    textColor:'#1A1A1A', subtextColor:'#555555',
    showCornerDeco:false, showGoldLine:false, frontLayout:'name-left',
    qrPosition:'bottom-right', fontFamily:'josefin',
    showTagline:false, style:'professional',
  },
  corpblue: {
    label:'Corporate Blue', category:'professional', preview:'▐',
    bgColor:'#FFFFFF', bgColor2:'#F0F4F8', accentColor:'#1565C0',
    textColor:'#1A1A1A', subtextColor:'#546E7A',
    showCornerDeco:false, showGoldLine:false, frontLayout:'name-left',
    qrPosition:'bottom-right', fontFamily:'josefin',
    showTagline:true, style:'professional',
  },
  marblegold: {
    label:'Marble Gold', category:'professional', preview:'◈',
    bgColor:'#FAFAF8', bgColor2:'#F5F0E8', accentColor:'#B8860B',
    textColor:'#2C2C2C', subtextColor:'#6B6B6B',
    showCornerDeco:true, showGoldLine:true, frontLayout:'name-center',
    qrPosition:'bottom-right', fontFamily:'cormorant',
    showTagline:true, style:'professional',
  },
  hextech: {
    label:'Hexagon Tech', category:'professional', preview:'⬡',
    bgColor:'#0D1117', bgColor2:'#161B22', accentColor:'#00BCD4',
    textColor:'#E6EDF3', subtextColor:'#8B949E',
    showCornerDeco:false, showGoldLine:false, frontLayout:'name-left',
    qrPosition:'bottom-right', fontFamily:'bebas',
    showTagline:true, style:'professional',
  },
  botanical: {
    label:'Botanical', category:'professional', preview:'✿',
    bgColor:'#FFFFFF', bgColor2:'#F1F8E9', accentColor:'#2E7D32',
    textColor:'#1B5E20', subtextColor:'#558B2F',
    showCornerDeco:false, showGoldLine:false, frontLayout:'name-left',
    qrPosition:'bottom-right', fontFamily:'cormorant',
    showTagline:false, style:'professional',
  },
  sunsetwave: {
    label:'Sunset Wave', category:'professional', preview:'~',
    bgColor:'#FFFFFF', bgColor2:'#FFF8F0', accentColor:'#FF6D00',
    textColor:'#1A1A1A', subtextColor:'#795548',
    showCornerDeco:false, showGoldLine:false, frontLayout:'name-left',
    qrPosition:'bottom-right', fontFamily:'josefin',
    showTagline:true, style:'professional',
  },
  minlines: {
    label:'Minimal Lines', category:'professional', preview:'═',
    bgColor:'#FFFFFF', bgColor2:'#FAFAFA', accentColor:'#37474F',
    textColor:'#212121', subtextColor:'#757575',
    showCornerDeco:false, showGoldLine:true, frontLayout:'name-center',
    qrPosition:'bottom-right', fontFamily:'josefin',
    showTagline:false, style:'professional',
  },
  darkluxury: {
    label:'Dark Luxury', category:'professional', preview:'✦',
    bgColor:'#0A0A0A', bgColor2:'#1A1A1A', accentColor:'#D4AF37',
    textColor:'#F5F5F0', subtextColor:'#A0A09A',
    showCornerDeco:true, showGoldLine:true, frontLayout:'name-center',
    qrPosition:'bottom-right', fontFamily:'playfair',
    showTagline:true, style:'professional',
  },
}

export const FONTS = {
  playfair:  { label: 'Playfair Display',    css: "'Playfair Display', serif"   },
  cormorant: { label: 'Cormorant Garamond',  css: "'Cormorant Garamond', serif" },
  bebas:     { label: 'Bebas Neue',          css: "'Bebas Neue', sans-serif"    },
  josefin:   { label: 'Josefin Sans',        css: "'Josefin Sans', sans-serif"  },
  dmSerif:   { label: 'DM Serif Display',    css: "'DM Serif Display', serif"   },
} as const

export const DEFAULT_DESIGN: Omit<TemplateConfig, 'label'|'category'|'preview'|'style'> = {
  bgColor:        '#0A0A0A',
  bgColor2:       '#1a1410',
  accentColor:    '#C9A84C',
  textColor:      '#FFFFFF',
  subtextColor:   '#888884',
  frontLayout:    'name-left',
  showCornerDeco: true,
  showGoldLine:   true,
  qrPosition:     'bottom-right',
  fontFamily:     'playfair',
  showTagline:    true,
}

export const CATEGORY_LABELS: Record<string, string> = {
  all:          'All Templates',
  professional: 'Professional',
  dark:         'Dark',
  light:        'Light',
  minimal:      'Minimal',
  colorful:     'Colorful',
}
