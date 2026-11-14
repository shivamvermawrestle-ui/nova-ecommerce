import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import ConnectedToDB from './DataBase/DataBase.js'
import router from './Routes/Route.js'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const app = express()
const PORT = process.env.PORT || 5002

const frontendOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(url => url.trim().replace(/\/$/, ''))
  .filter(Boolean)

const allowedOrigins = [
  ...frontendOrigins,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
]

app.use(cors({
    origin: function (origin, callback) {
        if (!origin ||
            allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            origin.startsWith('http://localhost:') ||
            origin.startsWith('http://127.0.0.1:') ||
            origin.startsWith('http://10.') ||
            origin.startsWith('http://192.168.')) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))

app.use(cookieParser())
app.use('/api/webhook', express.raw({ type: 'application/json' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json())

// Reuse the MongoDB connection across warm serverless invocations.
app.use(async (_req, res, next) => {
    try {
        await ConnectedToDB()
        next()
    } catch (error) {
        console.error('Database connection failed:', error?.message || error)
        res.status(503).json({
            message: 'Database connection unavailable.',
            success: false
        })
    }
})

app.use('/api', router)

// DEPLOY_TARGET is set to "vercel" in the Vercel project environment.
if (process.env.DEPLOY_TARGET !== 'vercel') {
    ConnectedToDB()
      .then(() => {
        app.listen(PORT, () => {
          console.log('Database connected successfully')
          console.log(`Server is running on port : ${PORT}`)
        })
      })
      .catch((error) => {
        console.error('Database connection failed:', error?.message || error)
      })
}

export default app
