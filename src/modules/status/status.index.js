import express from 'express'
import { StatusModel } from './status.mongoose.js'

const router = express.Router()

// GET /status - básico
router.get('/', (req, res) => {
  res.json({ message: 'OK' })
})

// POST /status/ping - guarda un ping simple
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

//intento de ping automatico

setInterval(async () => {
  try {
    await StatusModel.create({
      responseCode: 200,
      responseTime: Math.floor(Math.random() * 100),
      timestamp: new Date()
    })
    console.log('ping auto guardado')
  } catch (e) {
    console.error('error en ping auto', e)
  }
}, 5 * 60 * 1000) // 5 minutos
