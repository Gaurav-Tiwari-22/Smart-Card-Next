'use client'

import { useState } from 'react'

const SECTIONS = [
  {
    id: 'intro',
    title: '1. System Overview',
    content: `SmartCard ek full-stack Next.js application hai jo tumhare liye ek premium digital business card system banata hai.

**Dono QR Codes kaise kaam karte hain:**

→ Front QR (Contact): Jab koi scan kare → unke phone mein teri contact info automatic save ho jaati hai (vCard format mein). Ek bhi button press karne ki zaroorat nahi!

→ Back QR (Portfolio): Jab koi scan kare → directly tere portfolio website pe redirect hota hai. Perfect for showcasing projects.

**Smart QR System (NEW ✨):**
→ Contact QR ab URL-based hai — QR mein permanent URL encode hota hai (yourdomain.com/api/contact/slug)
→ Agar tum apna phone, email, ya koi bhi info update karo — QR SAME rehta hai!
→ Matlab ek baar card print karwao — phir kabhi reprint ki zaroorat nahi
→ Server hamesha latest info serve karta hai jab koi scan kare

**Tech Stack:**
- Frontend + Backend: Next.js 16 (App Router + Turbopack)
- Database: MongoDB Atlas
- Auth: JWT Tokens
- QR Generation: qrcode npm package
- Card Download: html2canvas (PNG export)
- Deploy: Vercel (free)`
  },
  {
    id: 'login',
    title: '2. Login & Registration',
    content: `**Demo User (Direct Login karo):**
Email: demo@smartcard.dev
Password: demo123

**Apna Account Banana:**
1. /dashboard pe jao
2. "Register" tab click karo
3. Fill karo: Name, Email, Password, Slug
4. Slug = tera unique URL (sirf lowercase letters, numbers, hyphens)
   Example: "gaurav" → Contact QR URL banega: yourdomain.com/api/contact/gaurav
5. Submit karo — turant login ho jaoge

**Slug rules:**
- Sirf lowercase: a-z, 0-9, hyphen (-)
- Ek baar set karne ke baad slug change nahi hota
- Unique hona chahiye — agar "gaurav" le liya toh "gaurav" available nahi hoga`
  },
  {
    id: 'theme',
    title: '3. Theme Gallery — 20 Premium Themes',
    content: `**Step 1: Theme Gallery kholo**
Sidebar mein "Theme Gallery" click karo (star icon — 20 badge dikhega)

**Step 2: Category filter use karo**
- All: Sabhi 20 themes
- Professional (NEW ✨): 8 naye premium designs — Vistaprint/Freepik inspired
- Dark: Dark backgrounds (Executive, JimmyBrook, Neon, etc.)
- Light: White/light themes (AquaClean, Rose Gold)
- Minimal: Clean minimal designs
- Colorful: Vibrant themes (BlueCorp, Midnight Green)

**New Professional Themes (8 templates):**
→ Aviato Red — White bg + red wave separator + company logo area
→ Corporate Blue — Navy sidebar + white main area + diagonal stripe
→ Marble Gold — Elegant marble texture + gold double-border frame
→ Hexagon Tech — Dark bg + cyan hexagon SVG pattern overlay
→ Botanical — White bg + leaf SVG corner decorations + green accents
→ Sunset Wave — SVG wave separator + orange gradient accent
→ Minimal Lines — Clean white + dot pattern + centered layout
→ Dark Luxury — Black bg + gold geometric frame + diamond ornaments

**Step 3: Theme select karo**
- Kisi bhi theme thumbnail pe click karo
- Right side pe bada preview aayega (front + back flip)
- "Apply Theme" dabao

**Step 4: Customize tab pe fine-tune karo**
- Colors change karo (5 color pickers)
- Font change karo (5 options: Playfair, Cormorant, Bebas Neue, Josefin, DM Serif)
- Layout adjust karo (name alignment, QR position)
- Toggles use karo (corner deco, gold line, tagline on/off)
- Tagline text change karo
- Save Design dabao`
  },
  {
    id: 'info',
    title: '4. Card Info — Personal Details',
    content: `**Card Info Tab pe jao**

**Personal Info:**
- Full Name → Card pe bold mein dikhega
- Job Title → Name ke neeche, uppercase letters mein
- Email → Front card pe bottom mein + vCard mein
- Phone → Front card pe email ke neeche + vCard mein
- Company → vCard mein save hoga + Professional themes mein company logo area
- City → vCard mein address field

**Social Links:**
- Portfolio URL → YE IMPORTANT HAI! Back QR isi URL ko encode karta hai
  Format: https:// se shuru karke likho
  Example: https://gaurav.dev
- GitHub → Back card pe dikhega
- LinkedIn → Back card pe dikhega

**Skills:**
- Comma separated likho
- Back card pe tags ki tarah dikhte hain
- Maximum 6 show hote hain card pe
- Example: React, Node.js, MongoDB, Express, TypeScript

**Smart Update (NEW ✨):**
→ Info save karo → QR codes same rehte hain!
→ Contact QR permanent URL encode karta hai
→ Koi bhi info change karo — printed card ka QR still works
→ Server hamesha latest vCard serve karta hai`
  },
  {
    id: 'qr',
    title: '5. QR System — Test & Download',
    content: `**QR System Test Tab pe jao**

**Contact QR Test:**
1. "Test vCard URL" button dabao
2. System verify karega ki URL properly kaam kar rahi hai
3. Green "✓ Working perfectly" aana chahiye
4. Agar fail ho → server running hai ki nahi check karo

**Smart QR Explained (NEW ✨):**
→ PEHLE: QR mein raw vCard data tha → har update pe QR change hota tha
→ AB: QR mein permanent URL hai → /api/contact/slug
→ Matlab: Print ek baar → Update kabhi bhi → QR same rehta hai!

**vCard Data Preview:**
- Exact data jo server deta hai woh dikhata hai
- Har field verify karo — name, phone, email sab sahi hona chahiye
- Agar galat data hai → Card Info mein update karo → Refresh QRs dabao

**QR Download karna (Print ke liye):**
1. Contact QR: "↓ Download" dabao → 400×400px PNG milegi
2. Portfolio QR: "↓ Download" dabao → 400×400px PNG milegi
3. Ye files print ke liye ready hain

**Phone pe Test karna:**
1. Apna phone lo
2. Camera app open karo (default, QR scanner mat use karo)
3. Contact QR ke saamne camera rakho
4. "Add Contact" prompt aana chahiye
5. Save karo — teri poori info save hogi!

**Important:** Phone se scan tab kaam karega jab app deployed ho (Vercel pe). Localhost pe phone reach nahi kar pata.`
  },
  {
    id: 'download',
    title: '6. Card Download & Print (NEW ✨)',
    content: `**Direct Card Download (NEW Feature!)**
Ab tum card front aur back ko directly high-resolution PNG mein download kar sakte ho — Figma ki zaroorat nahi!

**Dashboard se Download:**
1. Dashboard pe jao
2. "Download Card for Print" section mein 3 buttons milenge:
   → Front ↓ — sirf front side download hoga
   → Back ↓ — sirf back side download hoga
   → Both ↓ — dono ek saath download honge

**Customize Page se Download:**
1. Customize tab pe jao
2. Live Preview ke neeche 3 download buttons hain:
   → ↓ Front PNG / ↓ Back PNG / ↓ Both

**Download Specifications:**
- Resolution: 1050×660px (3x upscaled from preview)
- Format: PNG with transparency support
- Layout: Exact same as dashboard preview — no difference!
- Card front: Name, title, contact info, QR code
- Card back: Tech stack, social links, portfolio QR

**Print karwana:**
- File directly print shop ko de do
- Card Size: 85mm × 54mm (standard business card)
- Material: PVC 0.76mm (premium) ya 350+ GSM card stock
- Finish: Matte lamination (professional look)
- Print shop ko bolo: "PNG file hai, 85×54mm mein fit karo"

**Estimated Cost (India):**
- 100 PVC cards: ₹800-1200
- 250 cards: ₹1500-2000
- Online: VistaPrint, PrintingForLess bhi use kar sakte ho`
  },
  {
    id: 'analytics',
    title: '7. Scan Analytics (NEW ✨)',
    content: `**Analytics Tab pe jao (sidebar mein "Analytics" click karo)**

**Real-time Stats:**
→ Contact Scans — kitne logon ne contact QR scan kiya
→ Portfolio Views — kitne logon ne portfolio QR scan kiya
→ Total Scans — dono milake
→ Conversion Rate — portfolio views / total scans (percentage)

**7-Day Bar Chart:**
→ Last 7 dinon ka REAL scan data dikhata hai
→ Gold bars = Contact scans
→ Blue bars = Portfolio scans
→ Agar koi scans nahi hai — "No scans yet" message aayega

**Scan History Table (NEW ✨):**
Jab koi tumhara QR scan karta hai, ye information automatically capture hoti hai:
→ 📱 Device — Mobile / Desktop / Tablet
→ 🌐 Browser — Chrome, Safari, Firefox, Edge
→ 💻 OS — Android, iOS, Windows, macOS, Linux
→ 🔗 IP Address — scanner ka IP (geo-location ke liye)
→ ⏰ Time — "2m ago", "1h ago", "3d ago" format mein

**Refresh Button:**
→ "⟳ Refresh" dabao real-time data load karne ke liye
→ Page pe wapas aane pe auto-fetch hota hai

**Tips Section:**
→ Useful tips milenge jaise:
→ "Scan to save" text QR ke neeche likhein
→ Email signature mein QR rakhein
→ WhatsApp status pe share karein`
  },
  {
    id: 'deploy',
    title: '8. Production Deploy Karna',
    content: `**Step 1: MongoDB Atlas Setup (Free)**
1. mongodb.com/atlas pe register karo
2. Free M0 cluster create karo
3. Database → Connect → Connect your application
4. Connection string copy karo (MONGODB_URI)
5. Network Access mein "Allow from anywhere" set karo (0.0.0.0/0)

**Step 2: .env.local banao**
Project folder mein:
\`\`\`
cp .env.local.example .env.local
\`\`\`
Fill karo:
- MONGODB_URI = Atlas connection string
- JWT_SECRET = koi bhi random 32+ character string
- NEXT_PUBLIC_APP_URL = https://yourdomain.com

**IMPORTANT:** NEXT_PUBLIC_APP_URL sahi set karo — ye Contact QR mein encode hota hai!
Agar galat URL doge toh phone se scan karne pe contact save nahi hoga.

**Step 3: Dummy user seed karo (optional)**
\`\`\`
node scripts/seed.js
\`\`\`
Email: demo@smartcard.dev | Password: demo123

**Step 4: Vercel Deploy (Free)**
1. GitHub pe push karo
2. vercel.com pe import karo
3. Environment Variables add karo (MONGODB_URI, JWT_SECRET, NEXT_PUBLIC_APP_URL)
4. Deploy! 

**Step 5: Domain Connect (Optional)**
- Vercel Settings → Domains → Add domain
- Namecheap DNS mein Vercel ke CNAME records add karo
- SSL automatic mil jaata hai

**After Deploy — Test karo:**
1. Apne phone se Contact QR scan karo — contact save hona chahiye
2. Analytics tab check karo — scan count badhna chahiye
3. Scan history mein apna device dikhna chahiye

**Total Cost: ~₹600/year (sirf domain ke liye — baaki sab free!)**`
  },
  {
    id: 'flow',
    title: '9. Complete User Flow',
    content: `**New User Flow:**
Register → Set slug → Fill info → Choose theme (20 options!) → Customize → Save design → Test QR → Download card (Front + Back PNG) → Print card → Distribute!

**Card Receive karne wale ka Flow:**
Card mile → QR scan karo → 
  Contact QR: Phone browser URL open karta hai → Latest vCard download → Contact auto-save
  Portfolio QR: Browser open → Portfolio dekho

**Info Update karne ka Flow (Smart QR ✨):**
Login → Card Info update karo → Save → Done!
→ QR code CHANGE NAHI HOTA
→ Already printed cards still work — latest info milti hai scan pe
→ Reprint ki ZAROORAT NAHI!

**Analytics Monitor karna:**
Login → Analytics tab → Real-time stats dekho → Scan history table check karo → Device/browser/IP info dekho

**Card Download karna:**
Login → Dashboard ya Customize tab → Download Front/Back/Both → Print shop ko de do → Done!

**Important Notes:**
→ Smart QR: Contact QR permanent URL encode karta hai — info update = QR same
→ Card Download: PNG directly print-ready hai — Figma ki zaroorat nahi
→ Scan Tracking: Har scan pe device, browser, OS, IP automatically capture hota hai
→ 20 Themes: 12 original + 8 professional (Vistaprint/Freepik style)
→ Phone Testing: Deploy ke baad hi phone se scan kaam karega (localhost pe nahi)`
  },
]

export function DocsPage() {
  const [active, setActive] = useState('intro')
  const activeSection = SECTIONS.find(s => s.id === active)

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} style={{ fontSize:12, fontWeight:700, color:'var(--tx)', margin:'14px 0 6px', letterSpacing:'.02em' }}>{line.replace(/\*\*/g,'')}</div>
      }
      if (line.startsWith('→')) {
        return <div key={i} style={{ display:'flex', gap:8, padding:'5px 0', fontSize:12, color:'var(--mt)', lineHeight:1.6 }}>
          <span style={{ color:'var(--gold)', flexShrink:0, marginTop:1 }}>→</span>
          <span>{line.slice(2)}</span>
        </div>
      }
      if (/^\d+\./.test(line)) {
        return <div key={i} style={{ display:'flex', gap:8, padding:'3px 0', fontSize:12, color:'var(--mt)', lineHeight:1.6 }}>
          <span style={{ color:'var(--gold)', flexShrink:0, fontWeight:600, minWidth:16 }}>{line.match(/^\d+/)?.[0]}.</span>
          <span>{line.replace(/^\d+\.\s*/,'')}</span>
        </div>
      }
      if (line.startsWith('- ')) {
        return <div key={i} style={{ display:'flex', gap:8, padding:'2px 0', fontSize:12, color:'var(--mt)', paddingLeft:8 }}>
          <span style={{ color:'var(--mt2)', flexShrink:0 }}>•</span>
          <span>{line.slice(2)}</span>
        </div>
      }
      if (line.startsWith('```')) return null
      if (line.trim() === '') return <div key={i} style={{ height:6 }} />
      return <div key={i} style={{ fontSize:12, color:'var(--mt)', lineHeight:1.7, padding:'1px 0' }}>{line}</div>
    })
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap:16 }}>
      {/* Sidebar TOC */}
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            style={{
              padding:'9px 12px', borderRadius:8, border:'none', textAlign:'left',
              background: active===s.id ? 'var(--goldx)' : 'transparent',
              color: active===s.id ? 'var(--gold)' : 'var(--mt)',
              fontSize:12, fontWeight: active===s.id ? 500 : 400,
              cursor:'pointer', fontFamily:'Outfit,sans-serif',
              transition:'all .15s', borderLeft: active===s.id ? '2px solid var(--gold)' : '2px solid transparent',
            }}
          >{s.title}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ background:'var(--bg2)', border:'0.5px solid var(--brd)', borderRadius:12, padding:'24px 28px', minHeight:500 }}>
        <div style={{ fontSize:18, fontWeight:700, color:'var(--tx)', marginBottom:6 }}>{activeSection?.title}</div>
        <div style={{ height:'0.5px', background:'var(--brd)', marginBottom:18 }} />
        <div style={{ maxWidth:640 }}>
          {activeSection && renderContent(activeSection.content)}
        </div>

        {/* Navigation */}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:32, paddingTop:16, borderTop:'0.5px solid var(--brd)' }}>
          {SECTIONS.findIndex(s=>s.id===active) > 0 && (
            <button
              onClick={() => setActive(SECTIONS[SECTIONS.findIndex(s=>s.id===active)-1].id)}
              style={{ padding:'8px 16px', background:'transparent', border:'0.5px solid var(--brd2)', borderRadius:8, color:'var(--tx)', fontSize:12, cursor:'pointer', fontFamily:'Outfit,sans-serif' }}
            >← Previous</button>
          )}
          <div />
          {SECTIONS.findIndex(s=>s.id===active) < SECTIONS.length-1 && (
            <button
              onClick={() => setActive(SECTIONS[SECTIONS.findIndex(s=>s.id===active)+1].id)}
              style={{ padding:'8px 16px', background:'linear-gradient(135deg,#C9A84C,#9A7A28)', border:'none', borderRadius:8, color:'#000', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'Outfit,sans-serif' }}
            >Next →</button>
          )}
        </div>
      </div>
    </div>
  )
}
