import { User } from '@/types'

export function buildVCard(user: Partial<User> & { email?: string; name?: string }): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${user.name || ''}`,
    `N:${(user.name || '').split(' ').reverse().join(';')};;`,
    user.phone ? `TEL;TYPE=CELL:${user.phone}` : null,
    user.email ? `EMAIL;TYPE=WORK:${user.email}` : null,
    user.company ? `ORG:${user.company}` : null,
    user.jobTitle ? `TITLE:${user.jobTitle}` : null,
    user.portfolioUrl ? `URL:${user.portfolioUrl}` : null,
    user.city ? `ADR:;;${user.city};;;IN` : null,
    user.linkedin ? `X-SOCIALPROFILE;type=linkedin:${user.linkedin}` : null,
    user.github ? `X-SOCIALPROFILE;type=github:${user.github}` : null,
    'END:VCARD',
  ]
  return lines.filter(Boolean).join('\r\n')
}
