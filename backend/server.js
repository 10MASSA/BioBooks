import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import dotenv from 'dotenv'
import ordersRouter from './routes/orders.js'
import adminRouter from './routes/admin.js'
import productsRouter from './routes/products.js'
import cmsRouter from './routes/cms.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// ✅ Sécurité : headers HTTP (protection XSS, clickjacking, etc.)
app.use(helmet())

// ✅ Sécurité : CORS restreint au domaine autorisé
const allowedOrigins = [
  'https://bio-books-hzff.vercel.app',
  'http://localhost:5173', // développement local
]
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))

// ✅ Sécurité : limite à 100 requêtes par 15 minutes par IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, réessayez dans 15 minutes.' },
})
app.use('/api/', limiter)

// ✅ Sécurité : limite plus stricte pour les commandes (10 par heure)
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Trop de commandes, réessayez dans une heure.' },
})
app.use('/api/orders', orderLimiter)

app.use(express.json())

app.use('/api/orders', ordersRouter)
app.use('/api/admin', adminRouter)
app.use('/api/products', productsRouter)
app.use('/api/content', cmsRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

