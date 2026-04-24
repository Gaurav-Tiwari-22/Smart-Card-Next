/**
 * Dummy User Seed Script
 * Usage: node scripts/seed.js
 * Requires: MONGODB_URI in .env.local
 */
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && v.length) process.env[k.trim()] = v.join('=').trim()
  })
}

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not found in .env.local')
  console.error('    Copy .env.local.example → .env.local and fill in the URI')
  process.exit(1)
}

const cardDesignSchema = new mongoose.Schema({
  template:'String', bgColor:'String', bgColor2:'String',
  accentColor:'String', textColor:'String', subtextColor:'String',
  frontLayout:'String', showCornerDeco:'Boolean', showGoldLine:'Boolean',
  qrPosition:'String', backLayout:'String', fontFamily:'String',
  showTagline:'Boolean', tagline:'String',
}, { _id: false })

const userSchema = new mongoose.Schema({
  email:{ type:String, unique:true, lowercase:true },
  password:String, name:String, slug:{ type:String, unique:true },
  jobTitle:String, phone:String, company:String, city:String,
  website:String, portfolioUrl:String, github:String, linkedin:String,
  twitter:String, skills:[String],
  cardDesign:{ type:cardDesignSchema, default:()=>({}) },
  contactScans:{ type:Number, default:0 },
  portfolioScans:{ type:Number, default:0 },
  scanHistory:[{ type:String, timestamp:Date, userAgent:String }],
}, { timestamps:true })

const User = mongoose.models.User || mongoose.model('User', userSchema)

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ MongoDB connected')

  await User.deleteOne({ email: 'demo@smartcard.dev' })

  const hashed = await bcrypt.hash('demo123', 12)
  await User.create({
    name: 'Gaurav Sharma',
    slug: 'gaurav',
    email: 'demo@smartcard.dev',
    password: hashed,
    jobTitle: 'Full Stack Developer · MERN',
    phone: '+91 98765 43210',
    company: 'Freelance',
    city: 'Jaipur, Rajasthan',
    portfolioUrl: 'https://gaurav.dev',
    github: 'github.com/gaurav-sharma',
    linkedin: 'linkedin.com/in/gaurav-sharma',
    twitter: '@gaurav_dev',
    skills: ['React','Node.js','MongoDB','Express','TypeScript','Next.js'],
    contactScans: 47,
    portfolioScans: 31,
    cardDesign: {
      template:'jimmybrook', bgColor:'#1B1F3B', bgColor2:'#2D325A',
      accentColor:'#C9A84C', textColor:'#FFFFFF', subtextColor:'#C4BBDD',
      frontLayout:'name-left', showCornerDeco:false, showGoldLine:true,
      qrPosition:'top-right', backLayout:'split', fontFamily:'playfair',
      showTagline:true, tagline:'Turning Your Ideas into Scalable Digital Products',
    },
  })

  console.log('\n🎉 Demo user created successfully!\n')
  console.log('   📧 Email:    demo@smartcard.dev')
  console.log('   🔑 Password: demo123')
  console.log('   🔗 Slug:     /gaurav')
  console.log('   📱 vCard:    /api/contact/gaurav\n')
  await mongoose.disconnect()
}

seed().catch(e => { console.error('❌', e.message); process.exit(1) })
