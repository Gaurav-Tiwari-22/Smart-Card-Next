import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import UserModel from '@/models/User'

const DESIGN_FIELDS = [
  'template','bgColor','bgColor2','accentColor','textColor','subtextColor',
  'frontLayout','showCornerDeco','showGoldLine','qrPosition',
  'backLayout','fontFamily','showTagline','tagline',
]

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const updates: Record<string, unknown> = {}
    DESIGN_FIELDS.forEach(f => {
      if (body[f] !== undefined) updates[`cardDesign.${f}`] = body[f]
    })

    const updated = await UserModel.findByIdAndUpdate(
      user._id, { $set: updates }, { new: true }
    )

    return NextResponse.json({ message: 'Design saved', cardDesign: updated?.cardDesign })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
