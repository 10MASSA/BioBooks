import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ordersRouter from './routes/orders.js'
import adminRouter from './routes/admin.js'
import productsRouter from './routes/products.js'
import cmsRouter from './routes/cms.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
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
