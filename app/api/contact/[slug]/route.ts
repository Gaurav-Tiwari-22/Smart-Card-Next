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

    // Track scan with full device info
    const scanRecord = buildScanRecord(req, 'contact')
    await UserModel.findByIdAndUpdate(user._id, {
      $inc: { contactScans: 1 },
      $push: { scanHistory: scanRecord },
    })

    const vcard = buildVCard(user.toPublic() as Parameters<typeof buildVCard>[0])

    return new NextResponse(vcard, {
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': `inline; filename="${slug}.vcf"`,
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
