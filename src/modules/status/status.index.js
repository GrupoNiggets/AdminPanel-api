import express from 'express'
import { StatusModel } from './status.mongoose.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'OK' })
})

router.post('/ping', async (req, res) => {
  try {
    const start = Date.now()

    await new Promise(r => setTimeout(r, 0))

    const end = Date.now()
    const responseTime = end - start

    const doc = await StatusModel.create({
      responseCode: 200,
      responseTime,
      timestamp: new Date()
    })

    res.json({ ok: true, saved: doc })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'error guardando el ping' })
  }
})

export default router

setInterval(async () => {
  try {
    const start = Date.now()
    await new Promise(r => setTimeout(r, 0))
    const end = Date.now()
    const responseTime = end - start

    await StatusModel.create({
      responseCode: 200,
      responseTime,
      timestamp: new Date()
    })
    console.log('ping auto guardado')
  } catch (e) {
    console.error('error en ping auto', e)
  }
}, 5 * 60 * 1000)
