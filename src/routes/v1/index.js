import { Router } from 'express'
import usersRoutes from './users.routes.js'
import chatRoutes from './chat.routes.js'

const router = Router()

router.use('/users', usersRoutes)
router.use('/chat', chatRoutes)

export default router


