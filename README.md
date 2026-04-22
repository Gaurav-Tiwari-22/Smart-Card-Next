# SmartCard v2.0 — Next.js Premium Business Card System

Full-stack Next.js application for smart physical business cards with dynamic QR codes, 12 premium themes, and a complete admin dashboard.

## ✨ What's New in v2.0
- 12 Premium themes (inspired by Freepik references: JimmyBrook, BlueCorp, AquaClean + 9 more)
- Theme Gallery with live preview and category filters
- QR System Test page — verify both QRs are working
- vCard data preview — see exactly what gets saved to phone
- User Guide (Hindi) — complete system documentation
- Dummy user seed script

## 🚀 Quick Start

### 1. Install
```bash
npm install
```

### 2. Environment
```bash
cp .env.local.example .env.local
```
Edit `.env.local`:
```
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/smartcard
JWT_SECRET=any_random_string_32_chars_minimum
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Create Demo User
```bash
npm run seed
# Creates: demo@smartcard.dev / demo123
```

### 4. Run
```bash
npm run dev
# Open http://localhost:3000
```

## 🔑 Demo Login
```
Email:    demo@smartcard.dev
Password: demo123
```

## 📱 How QR Codes Work

| QR | Location | Scan Result |
|----|----------|-------------|
| Contact QR | Front of card | Downloads vCard → Phone saves contact automatically |
| Portfolio QR | Back of card | Opens your portfolio URL in browser |

**Contact QR URL format:** `https://yourdomain.com/api/contact/[slug]`

When someone scans → server sends `.vcf` file → phone prompts "Add Contact" → one tap saves all info.

## 🎨 12 Premium Themes

| Theme | Style | Category |
|-------|-------|----------|
| JimmyBrook | Dark navy + gold strip | Dark |
| BlueCorp | Geometric grid | Colorful |
| AquaClean | White + teal bubbles | Light |
| Executive | Dark gold corners | Dark |
| Minimal | Clean white | Minimal |
| Bold Tech | Dark blue diagonal | Dark |
| Purple Glass | Deep purple | Dark |
| Neon | Terminal green | Dark |
| Editorial | Dark orange split | Dark |
| Rose Gold | Pink luxury | Light |
| Midnight Green | Forest dark | Dark |
| Crimson | Deep red | Colorful |

## 📁 Project Structure

```
smartcard-next/
├── app/
│   ├── api/
│   │   ├── auth/          # register, login, me
│   │   ├── card/          # GET, info, design, analytics, qr
│   │   ├── contact/[slug] # vCard download (Contact QR target)
│   │   └── track/         # Scan analytics
│   ├── dashboard/         # Main SPA page
│   └── layout.tsx
├── components/
│   ├── card/CardPreview   # 3D flip card with 6 render styles
│   └── dashboard/
│       ├── AuthPage       # Login + Register
│       ├── DashboardPage  # Overview + stats + QR download
│       ├── InfoPage       # Edit card info + live preview
│       ├── ThemeGallery   # 12 themes with live preview
│       ├── DesignPage     # Fine-tune colors/fonts/layout
│       ├── QRTestPage     # Test + verify both QRs
│       ├── AnalyticsPage  # Scan stats + bar chart
│       ├── DocsPage       # User guide (Hindi)
│       └── SetupPage      # Deploy guide
├── hooks/                 # useAuth, useToast
├── lib/                   # db, auth, vcard, cardConstants (12 themes)
├── models/User.ts         # Mongoose schema
├── scripts/seed.js        # Demo user creator
└── types/index.ts
```

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import at vercel.com
3. Add env vars: `MONGODB_URI`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`
4. Deploy — done! (Free tier works perfectly)

## 🖨️ Print Specifications

| Property | Value |
|----------|-------|
| Card Size | 85mm × 54mm |
| Material | PVC 0.76mm or 350+ GSM |
| Finish | Matte lamination |
| QR Export | 400×400px PNG (from QR Test page) |
| Color Mode | CMYK for printing |

## 🔧 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login → JWT |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/card | Yes | Card data + QR base64 |
| PUT | /api/card/info | Yes | Update personal info |
| PUT | /api/card/design | Yes | Update card design |
| GET | /api/card/analytics | Yes | Scan stats |
| GET | /api/card/qr | Yes | Fresh QR codes |
| GET | /api/contact/[slug] | No | vCard file download |
| POST | /api/track/[type]/[slug] | No | Track scan |
