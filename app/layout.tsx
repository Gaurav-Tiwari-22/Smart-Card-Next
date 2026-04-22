import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SmartCard — Premium Digital Business Card',
  description: 'Create your smart physical business card with dynamic QR codes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@300;400;600&family=Bebas+Neue&family=Josefin+Sans:wght@300;400;600&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: 'Outfit, sans-serif', margin: 0, background: '#0C0C0E', color: '#F0EFE8' }}>
        {children}
      </body>
    </html>
  )
}
