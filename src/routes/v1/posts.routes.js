import { Router } from 'express'
import Joi from 'joi'
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} from '../../modules/posts/post.index.js'
import { createPostSchema, updatePostSchema } from '../../modules/posts/post.validator.js'

const router = Router()

function validate(schema) {
  return (req, res, next) => {
    const toValidate = ['GET', 'DELETE'].includes(req.method) ? req.params : req.body
    const result = schema.validate(toValidate, { abortEarly: false, stripUnknown: true })
    if (result.error) {
      const details = result.error.details.map(d => d.message)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos', details } })
    }
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) req.body = result.value
    else req.params = result.value
    next()
  }
}

/**
 * @swagger
 * /v1/posts:
 *   get:
 *     summary: Obtener lista de posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts obtenida exitosamente
 */
router.get('/', listPosts)

/**
 * @swagger
 * /v1/posts/{id}:
 *   get:
 *     summary: Obtener un post por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del post
 *     responses:
 *       200:
 *         description: Post encontrado
 *       404:
 *         description: Post no encontrado
 */
router.get('/:id', validate(Joi.object({ id: Joi.string().uuid().required() })), getPost)

/**
 * @swagger
 * /v1/posts:
 *   post:
 *     summary: Crear un nuevo post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Post creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', validate(createPostSchema), createPost)

/**
 * @swagger
 * /v1/posts/{id}:
 *   put:
 *     summary: Actualizar un post completamente
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Post actualizado exitosamente
 *       404:
 *         description: Post no encontrado
 *   patch:
 *     summary: Actualizar un post parcialmente
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Post actualizado exitosamente
 *       404:
 *         description: Post no encontrado
 */
router.put('/:id', validate(updatePostSchema), updatePost)
router.patch('/:id', validate(updatePostSchema), updatePost)

/**
 * @swagger
 * /v1/posts/{id}:
 *   delete:
 *     summary: Eliminar un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post eliminado exitosamente
 *       404:
 *         description: Post no encontrado
 */
router.delete('/:id', validate(Joi.object({ id: Joi.string().uuid().required() })), deletePost)

export default router

