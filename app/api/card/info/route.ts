import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { getAuthUser } from '@/lib/auth'
import { buildVCard } from '@/lib/vcard'
import UserModel from '@/models/User'

const ALLOWED = ['name','jobTitle','phone','company','city','website',
                 'github','linkedin','twitter','portfolioUrl','skills']

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const updates: Record<string, unknown> = {}
    ALLOWED.forEach(f => { if (body[f] !== undefined) updates[f] = body[f] })

    const updated = await UserModel.findByIdAndUpdate(
      user._id, { $set: updates }, { new: true }
    )
    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const vCardUrl = `${appUrl}/api/contact/${updated.slug}`
    // Encode the permanent vCard URL instead of raw vCard data
    const contactQR = await QRCode.toDataURL(vCardUrl, { errorCorrectionLevel: 'H', width: 400, margin: 2 })
    const portfolioUrl = updated.portfolioUrl || `${appUrl}/p/${updated.slug}`
    const portfolioQR = await QRCode.toDataURL(portfolioUrl, { errorCorrectionLevel: 'M', width: 400, margin: 2 })

    return NextResponse.json({
      message: 'Info updated',
      user: updated.toPublic(),
      qr: { contact: contactQR, portfolio: portfolioQR },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
