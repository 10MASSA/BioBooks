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

// ✅ Nécessaire pour Railway (récupère la vraie IP de l'utilisateur derrière le proxy Railway)
app.set('trust proxy', 1)

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

// ✅ Sécurité : limite globale (exclut totalement la partie admin pour ne jamais bloquer l'administrateur)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path.startsWith('/admin'), // ne limite jamais l'admin
  message: { error: 'Trop de requêtes, réessayez dans 15 minutes.' },
})
app.use('/api/', limiter)

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

