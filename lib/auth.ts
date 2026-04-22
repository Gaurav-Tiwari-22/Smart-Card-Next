import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { connectDB } from './db'
import UserModel from '@/models/User'

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || ''
  if (!secret) {
    throw new Error('Please define JWT_SECRET in .env.local')
  }
  return secret
}

export function signToken(userId: string): string {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '30d' })
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, getJwtSecret()) as { userId: string }
}

export async function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.split(' ')[1]
  try {
    const { userId } = verifyToken(token)
    await connectDB()
    const user = await UserModel.findById(userId).select('-password -scanHistory')
    return user
  } catch {
    return null
  }
}
