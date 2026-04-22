import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { signToken } from '@/lib/auth'
import UserModel from '@/models/User'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, slug } = await req.json()

    if (!name || !email || !password || !slug)
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })

    if (!/^[a-z0-9-]+$/.test(slug))
      return NextResponse.json({ error: 'Slug: only lowercase letters, numbers, hyphens' }, { status: 400 })

    if (password.length < 6)
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

    await connectDB()

    if (await UserModel.findOne({ email }))
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })

    if (await UserModel.findOne({ slug }))
      return NextResponse.json({ error: 'Slug already taken' }, { status: 400 })

    const user = new UserModel({ name, email, password, slug })
    await user.save()

    const token = signToken(user._id.toString())
    return NextResponse.json({ token, user: user.toPublic() }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
