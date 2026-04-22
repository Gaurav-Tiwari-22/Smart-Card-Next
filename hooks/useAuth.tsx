'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { User, CardData, QRData } from '@/types'

const OFFLINE_DEMO_TOKEN = 'offline-demo-token'
const OFFLINE_DEMO_USER: User = {
  _id: 'offline-demo',
  name: 'Demo User',
  slug: 'demo',
  email: 'demo@smartcard.dev',
  jobTitle: 'Product Designer',
  phone: '+91 98765 43210',
  company: 'SmartCard Demo',
  city: 'Mumbai',
  website: 'https://smartcard.dev',
  portfolioUrl: 'https://smartcard.dev',
  github: 'demo',
  linkedin: 'demo',
  twitter: 'demo',
  skills: ['UI', 'UX', 'Web'],
  cardDesign: {
    template: 'executive',
    bgColor: '#0A0A0A',
    bgColor2: '#1a1410',
    accentColor: '#C9A84C',
    textColor: '#FFFFFF',
    subtextColor: '#888888',
    frontLayout: 'name-left',
    showCornerDeco: true,
    showGoldLine: true,
    qrPosition: 'bottom-right',
    backLayout: 'split',
    fontFamily: 'playfair',
    showTagline: true,
    tagline: 'Building Scalable Web Apps',
  },
  contactScans: 0,
  portfolioScans: 0,
  createdAt: new Date().toISOString(),
}
const OFFLINE_DEMO_QR: QRData = { contact: '', portfolio: '' }

interface AuthCtx {
  user: User | null
  token: string | null
  cardData: CardData | null
  loading: boolean
  login: (email: string, password: string) => Promise<string | null>
  register: (name: string, email: string, password: string, slug: string) => Promise<string | null>
  logout: () => void
  refreshCard: () => Promise<void>
  updateCardData: (data: Partial<CardData>) => void
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(true)

  const apiFetch = useCallback(async (path: string, opts: RequestInit = {}) => {
    const tk = token || (typeof window !== 'undefined' ? localStorage.getItem('sc_token') : null)
    const res = await fetch(path, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        ...(tk ? { Authorization: `Bearer ${tk}` } : {}),
        ...(opts.headers || {}),
      },
    })
    const text = await res.text()
    let data: any
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      throw new Error(text || 'Request failed')
    }
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
  }, [token])

  const refreshCard = useCallback(async () => {
    try {
      const data = await apiFetch('/api/card')
      setCardData(data)
      setUser(data.user)
    } catch {
      // ignore
    }
  }, [apiFetch])

  useEffect(() => {
    const stored = localStorage.getItem('sc_token')
    if (!stored) { setLoading(false); return }
    if (stored === OFFLINE_DEMO_TOKEN) {
      setToken(stored)
      setUser(OFFLINE_DEMO_USER)
      setCardData({ user: OFFLINE_DEMO_USER, qr: OFFLINE_DEMO_QR, vCardUrl: '' })
      setLoading(false)
      return
    }

    setToken(stored)
    apiFetch('/api/auth/me')
      .then(async (data) => {
        setUser(data.user)
        const cardRes = await fetch('/api/card', {
          headers: { Authorization: `Bearer ${stored}` },
        })
        if (cardRes.ok) {
          const cd = await cardRes.json()
          setCardData(cd)
        }
      })
      .catch(() => {
        if (stored === OFFLINE_DEMO_TOKEN) {
          setUser(OFFLINE_DEMO_USER)
          setCardData({ user: OFFLINE_DEMO_USER, qr: OFFLINE_DEMO_QR, vCardUrl: '' })
        } else {
          localStorage.removeItem('sc_token')
          setToken(null)
        }
      })
      .finally(() => setLoading(false))
  }, [apiFetch])

  const login = async (email: string, password: string): Promise<string | null> => {
    const isOfflineDemo = email === 'demo@smartcard.dev' && password === 'demo123'
    try {
      const data = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('sc_token', data.token)
      const cardRes = await fetch('/api/card', { headers: { Authorization: `Bearer ${data.token}` } })
      if (cardRes.ok) setCardData(await cardRes.json())
      return null
    } catch (e: unknown) {
      if (isOfflineDemo) {
        setToken(OFFLINE_DEMO_TOKEN)
        setUser(OFFLINE_DEMO_USER)
        setCardData({ user: OFFLINE_DEMO_USER, qr: OFFLINE_DEMO_QR, vCardUrl: '' })
        localStorage.setItem('sc_token', OFFLINE_DEMO_TOKEN)
        return null
      }
      return e instanceof Error ? e.message : 'Login failed'
    }
  }

  const register = async (name: string, email: string, password: string, slug: string): Promise<string | null> => {
    try {
      const data = await apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, slug }) })
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('sc_token', data.token)
      const cardRes = await fetch('/api/card', { headers: { Authorization: `Bearer ${data.token}` } })
      if (cardRes.ok) setCardData(await cardRes.json())
      return null
    } catch (e: unknown) {
      return e instanceof Error ? e.message : 'Registration failed'
    }
  }

  const logout = () => {
    setToken(null); setUser(null); setCardData(null)
    localStorage.removeItem('sc_token')
  }

  const updateCardData = (data: Partial<CardData>) => {
    setCardData(prev => prev ? { ...prev, ...data } : null)
    if (data.user) setUser(data.user)
  }

  return (
    <Ctx.Provider value={{ user, token, cardData, loading, login, register, logout, refreshCard, updateCardData }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
