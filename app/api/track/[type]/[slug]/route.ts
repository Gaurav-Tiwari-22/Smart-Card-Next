import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import UserModel from '@/models/User'
import { buildScanRecord } from '@/lib/scanUtils'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  try {
    const { type, slug } = await params
    if (!['contact', 'portfolio'].includes(type))
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

    await connectDB()
    const user = await UserModel.findOne({ slug })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const field = type === 'contact' ? 'contactScans' : 'portfolioScans'
    const scanRecord = buildScanRecord(req, type as 'contact' | 'portfolio')

    await UserModel.findByIdAndUpdate(user._id, {
      $inc: { [field]: 1 },
      $push: { scanHistory: scanRecord },
    })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
