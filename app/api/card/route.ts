import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { getAuthUser } from '@/lib/auth'
import { buildVCard } from '@/lib/vcard'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const vCardUrl = `${appUrl}/api/contact/${user.slug}`

    // Encode the permanent vCard URL instead of raw vCard data
    // This way QR stays same even when user updates their contact info
    const contactQR = await QRCode.toDataURL(vCardUrl, {
      errorCorrectionLevel: 'H', width: 400, margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
    })

    const portfolioUrl = user.portfolioUrl || `${appUrl}/p/${user.slug}`
    const portfolioQR = await QRCode.toDataURL(portfolioUrl, {
      errorCorrectionLevel: 'M', width: 400, margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
    })

    return NextResponse.json({
      user: user.toPublic(),
      qr: { contact: contactQR, portfolio: portfolioQR },
      vCardUrl,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
