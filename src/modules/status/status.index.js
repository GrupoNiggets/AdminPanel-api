import express from 'express'
import { StatusModel } from './status.mongoose.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'OK' })
})

router.post('/ping', async (req, res) => {
  try {
    const { responseCode, responseTime } = req.body
    
    const doc = await StatusModel.create({
      responseCode: responseCode || 200,
      responseTime: responseTime || 0,
      timestamp: new Date()
    })

    res.json({ ok: true, saved: doc })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'error guardando el ping' })
  }
})

export default router
