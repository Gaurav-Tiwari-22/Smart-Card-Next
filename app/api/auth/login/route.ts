import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { signToken } from '@/lib/auth'
import UserModel from '@/models/User'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password)
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

    await connectDB()
    const user = await UserModel.findOne({ email })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const ok = await user.comparePassword(password)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken(user._id.toString())
    return NextResponse.json({ token, user: user.toPublic() })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
