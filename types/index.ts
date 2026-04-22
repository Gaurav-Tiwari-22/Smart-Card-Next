export interface CardDesign {
  template:       string
  bgColor:        string
  bgColor2:       string
  accentColor:    string
  textColor:      string
  subtextColor:   string
  frontLayout:    'name-left' | 'name-center' | 'name-right'
  showCornerDeco: boolean
  showGoldLine:   boolean
  qrPosition:     'bottom-right' | 'bottom-left' | 'top-right'
  backLayout:     'split' | 'centered' | 'stack'
  fontFamily:     string
  showTagline:    boolean
  tagline:        string
}

export interface User {
  _id:            string
  name:           string
  slug:           string
  email:          string
  jobTitle:       string
  phone:          string
  company:        string
  city:           string
  website:        string
  portfolioUrl:   string
  github:         string
  linkedin:       string
  twitter:        string
  skills:         string[]
  cardDesign:     CardDesign
  contactScans:   number
  portfolioScans: number
  createdAt:      string
}

export interface AuthState {
  token: string | null
  user:  User   | null
}

export interface QRData {
  contact:   string
  portfolio: string
}

export interface CardData {
  user:     User
  qr:       QRData
  vCardUrl: string
}
