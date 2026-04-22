import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  slug: string
  jobTitle: string
  phone: string
  company: string
  city: string
  website: string
  portfolioUrl: string
  github: string
  linkedin: string
  twitter: string
  skills: string[]
  cardDesign: {
    template: string; bgColor: string; bgColor2: string
    accentColor: string; textColor: string; subtextColor: string
    frontLayout: string; showCornerDeco: boolean; showGoldLine: boolean
    qrPosition: string; backLayout: string; fontFamily: string
    showTagline: boolean; tagline: string
  }
  contactScans: number
  portfolioScans: number
  scanHistory: Array<{ type: string; timestamp: Date; userAgent: string; device: string; browser: string; os: string; ip: string }>
  comparePassword(candidate: string): Promise<boolean>
  toPublic(): object
}

const cardDesignSchema = new Schema({
  template:       { type: String,  default: 'executive' },
  bgColor:        { type: String,  default: '#0A0A0A' },
  bgColor2:       { type: String,  default: '#1a1410' },
  accentColor:    { type: String,  default: '#C9A84C' },
  textColor:      { type: String,  default: '#FFFFFF' },
  subtextColor:   { type: String,  default: '#888888' },
  frontLayout:    { type: String,  default: 'name-left' },
  showCornerDeco: { type: Boolean, default: true },
  showGoldLine:   { type: Boolean, default: true },
  qrPosition:     { type: String,  default: 'bottom-right' },
  backLayout:     { type: String,  default: 'split' },
  fontFamily:     { type: String,  default: 'playfair' },
  showTagline:    { type: Boolean, default: true },
  tagline:        { type: String,  default: 'Building Scalable Web Apps' },
}, { _id: false })

const userSchema = new Schema<IUser>({
  email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:      { type: String, required: true },
  name:          { type: String, required: true, trim: true },
  slug:          { type: String, required: true, unique: true, lowercase: true, trim: true },
  jobTitle:      { type: String, default: 'Full Stack Developer' },
  phone:         { type: String, default: '' },
  company:       { type: String, default: 'Freelance' },
  city:          { type: String, default: '' },
  website:       { type: String, default: '' },
  portfolioUrl:  { type: String, default: '' },
  github:        { type: String, default: '' },
  linkedin:      { type: String, default: '' },
  twitter:       { type: String, default: '' },
  skills:        [{ type: String }],
  cardDesign:    { type: cardDesignSchema, default: () => ({}) },
  contactScans:  { type: Number, default: 0 },
  portfolioScans:{ type: Number, default: 0 },
  scanHistory: [{
    type:      { type: String },
    timestamp: { type: Date, default: Date.now },
    userAgent: String,
    device:    { type: String, default: 'Unknown' },
    browser:   { type: String, default: 'Unknown' },
    os:        { type: String, default: 'Unknown' },
    ip:        { type: String, default: '' },
  }],
}, { timestamps: true })

// Mongoose 8 pre-save: async, no next() needed
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password as string, 12)
})

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password)
}

userSchema.methods.toPublic = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.scanHistory
  return obj
}

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema)
