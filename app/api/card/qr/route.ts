import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { getAuthUser } from '@/lib/auth'
import { buildVCard } from '@/lib/vcard'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Encode vCard data directly into QR — phones will show "Add to Contacts" instantly
    const vCardData = buildVCard(user.toPublic() as Parameters<typeof buildVCard>[0])
    const contactQR = await QRCode.toDataURL(vCardData, {
      errorCorrectionLevel: 'M', width: 400, margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
    })

    const portfolioUrl = user.portfolioUrl || `${appUrl}/p/${user.slug}`
    const portfolioQR = await QRCode.toDataURL(portfolioUrl, {
      errorCorrectionLevel: 'M', width: 400, margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
    })

    return NextResponse.json({ contact: contactQR, portfolio: portfolioQR })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
