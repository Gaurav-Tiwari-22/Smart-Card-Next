import { NextRequest } from 'next/server'

/**
 * Parse user-agent string into device, browser, and OS info.
 * Lightweight — no external dependencies.
 */
export function parseUserAgent(ua: string) {
  // Device type
  let device = 'Desktop'
  if (/Mobile|Android|iPhone|iPod/i.test(ua)) device = 'Mobile'
  else if (/iPad|Tablet/i.test(ua)) device = 'Tablet'

  // Browser
  let browser = 'Unknown'
  if (/Edg\//i.test(ua))         browser = 'Edge'
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera'
  else if (/Chrome/i.test(ua))    browser = 'Chrome'
  else if (/Safari/i.test(ua))    browser = 'Safari'
  else if (/Firefox/i.test(ua))   browser = 'Firefox'

  // OS
  let os = 'Unknown'
  if (/Windows NT 10/i.test(ua))       os = 'Windows 10/11'
  else if (/Windows/i.test(ua))        os = 'Windows'
  else if (/Mac OS X/i.test(ua))       os = 'macOS'
  else if (/Android (\d+)/i.test(ua))  os = `Android ${ua.match(/Android (\d+)/)?.[1]}`
  else if (/iPhone OS (\d+)/i.test(ua))os = `iOS ${ua.match(/iPhone OS (\d+)/)?.[1]}`
  else if (/iPad/i.test(ua))           os = 'iPadOS'
  else if (/Linux/i.test(ua))          os = 'Linux'

  return { device, browser, os }
}

/**
 * Get client IP from request headers (works behind proxies/Vercel/Cloudflare).
 * Falls back to 'unknown' if not detectable.
 */
export function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  )
}

/**
 * Build a complete scan record from a request.
 */
export function buildScanRecord(req: NextRequest, type: 'contact' | 'portfolio') {
  const ua = req.headers.get('user-agent') || 'unknown'
  const { device, browser, os } = parseUserAgent(ua)
  const ip = getClientIP(req)

  return {
    type,
    timestamp: new Date(),
    userAgent: ua,
    device,
    browser,
    os,
    ip,
  }
}
