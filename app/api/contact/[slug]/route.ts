import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { buildVCard } from '@/lib/vcard'
import UserModel from '@/models/User'
import { buildScanRecord } from '@/lib/scanUtils'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    await connectDB()
    const user = await UserModel.findOne({ slug: slug.toLowerCase() })

    if (!user) {
      return new NextResponse(
        `<html><body style="font-family:sans-serif;text-align:center;padding:60px">
          <h2>Card not found</h2><p>No card for: ${slug}</p>
        </body></html>`,
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      )
    }

    // If ?dl=1, serve VCF directly (iOS opens native Contacts sheet, Android downloads & opens Contacts)
    const download = req.nextUrl.searchParams.get('dl')
    if (download === '1') {
      const vcard = buildVCard(user.toPublic() as Parameters<typeof buildVCard>[0])
      return new NextResponse(vcard, {
        headers: {
          'Content-Type': 'text/vcard; charset=utf-8',
          // "inline" so iOS Safari shows native "Create New Contact" sheet directly
          'Content-Disposition': `inline; filename="${slug}.vcf"`,
        },
      })
    }

    // Track scan with full device info
    const scanRecord = buildScanRecord(req, 'contact')
    await UserModel.findByIdAndUpdate(user._id, {
      $inc: { contactScans: 1 },
      $push: { scanHistory: scanRecord },
    })

    const pub = user.toPublic()
    const initials = (pub.name || '')
      .split(' ')
      .map((w: string) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const vcfUrl = `${appUrl}/api/contact/${slug}?dl=1`

    // HTML page that auto-redirects to VCF URL on load
    // iOS Safari: navigating to a text/vcard URL opens the native "Add Contact" sheet as overlay
    // Android Chrome: downloads the VCF and prompts to open with Contacts app
    // The page shows contact info briefly + manual "Save Contact" button as fallback
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>${pub.name || 'Contact'} — Save Contact</title>
  <meta name="description" content="Save ${pub.name || ''}'s contact information directly to your phone." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0f;
      color: #fff;
      padding: 20px;
      overflow-x: hidden;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: 
        radial-gradient(ellipse 80% 60% at 50% -20%, rgba(168, 130, 63, 0.15) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 100%, rgba(168, 130, 63, 0.08) 0%, transparent 50%);
      z-index: 0;
    }

    .card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 400px;
      background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 40px 28px 32px;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 4px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
      animation: cardIn 0.5s ease forwards;
      opacity: 0;
      transform: translateY(16px);
    }

    @keyframes cardIn {
      to { opacity: 1; transform: translateY(0); }
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #a8823f 0%, #d4a853 50%, #a8823f 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 800;
      color: #0a0a0f;
      margin: 0 auto 16px;
      box-shadow: 0 4px 20px rgba(168, 130, 63, 0.3);
    }

    .name {
      font-size: 22px;
      font-weight: 700;
      text-align: center;
      background: linear-gradient(to right, #fff, #e0d5c5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 4px;
    }

    .subtitle {
      font-size: 13px;
      text-align: center;
      color: rgba(255,255,255,0.4);
      font-weight: 500;
      margin-bottom: 24px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 12px;
      text-decoration: none;
      color: inherit;
    }

    .info-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
    }

    .info-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: rgba(255,255,255,0.3);
      font-weight: 600;
    }

    .info-value {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255,255,255,0.85);
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
      margin: 12px 0 16px;
    }

    .status-text {
      text-align: center;
      font-size: 13px;
      color: rgba(255,255,255,0.5);
      margin-bottom: 16px;
      min-height: 20px;
    }

    .status-text .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(168,130,63,0.3);
      border-top-color: #d4a853;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      vertical-align: middle;
      margin-right: 6px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .save-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 15px 24px;
      border: none;
      border-radius: 14px;
      background: linear-gradient(135deg, #a8823f 0%, #d4a853 50%, #a8823f 100%);
      background-size: 200% 200%;
      color: #0a0a0f;
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.3px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(168, 130, 63, 0.3);
    }

    .save-btn:active {
      transform: scale(0.97);
    }

    .save-btn svg {
      width: 20px;
      height: 20px;
    }

    .save-btn.saved {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      pointer-events: none;
    }

    .powered {
      text-align: center;
      font-size: 10px;
      color: rgba(255,255,255,0.12);
      margin-top: 16px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar">${initials}</div>
    <div class="name">${pub.name || ''}</div>
    <div class="subtitle">${[pub.jobTitle, pub.company].filter(Boolean).join(' • ') || ''}</div>
    
    <div>
      ${pub.phone ? `
      <a href="tel:${pub.phone}" class="info-item">
        <div class="info-icon">📱</div>
        <div><div class="info-label">Phone</div><div class="info-value">${pub.phone}</div></div>
      </a>` : ''}
      ${pub.email ? `
      <a href="mailto:${pub.email}" class="info-item">
        <div class="info-icon">✉️</div>
        <div><div class="info-label">Email</div><div class="info-value">${pub.email}</div></div>
      </a>` : ''}
      ${pub.company ? `
      <div class="info-item">
        <div class="info-icon">🏢</div>
        <div><div class="info-label">Company</div><div class="info-value">${pub.company}</div></div>
      </div>` : ''}
      ${pub.city ? `
      <div class="info-item">
        <div class="info-icon">📍</div>
        <div><div class="info-label">Location</div><div class="info-value">${pub.city}</div></div>
      </div>` : ''}
    </div>
    
    <div class="divider"></div>
    
    <div id="statusText" class="status-text">
      <span class="spinner"></span> Opening contacts...
    </div>

    <button id="saveBtn" class="save-btn" onclick="saveContact()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="19" y1="8" x2="19" y2="14"/>
        <line x1="22" y1="11" x2="16" y2="11"/>
      </svg>
      Save Contact
    </button>
    
    <div class="powered">Smart Card</div>
  </div>

  <script>
    var vcfUrl = '${vcfUrl}';

    // Auto-trigger contact save on page load
    // iOS: window.location to VCF URL opens native "Add Contact" sheet as overlay
    // Android: navigating to VCF triggers download + "Open with Contacts" prompt
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.location.href = vcfUrl;
      }, 600);
    });

    // Manual fallback button
    function saveContact() {
      window.location.href = vcfUrl;
    }
  </script>
</body>
</html>`

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
