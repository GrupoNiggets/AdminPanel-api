import { Router } from 'express'
import usersRoutes from './users.routes.js'
import chatRoutes from './chat.routes.js'
import postsRoutes from './posts.routes.js'

const router = Router()

router.use('/users', usersRoutes)
router.use('/chat', chatRoutes)
router.use('/posts', postsRoutes)

export default router


