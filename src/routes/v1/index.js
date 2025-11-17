//IMPORTS
import { Router } from 'express'
import usersRoutes from './users.routes.js'
import chatRoutes from './chat.routes.js'
import postsRoutes from './posts.routes.js'
// import bugsRoutes from './bugs.routes.js'
// import statusRoutes from './status.routes.js'

//router
const router = Router()

//RUTAS DEFINIDAS
router.use('/users', usersRoutes)
router.use('/chat', chatRoutes)
router.use('/posts', postsRoutes)
// router.use('/bugs', bugsRoutes)
// router.use('/status', statusRoutes)

//EXPORT router
export default router


