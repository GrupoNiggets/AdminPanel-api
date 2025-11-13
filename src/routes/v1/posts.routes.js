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

function validate (schema) {
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

router.get('/', listPosts)
router.get('/:id', validate(Joi.object({ id: Joi.string().uuid().required() })), getPost)
router.post('/', validate(createPostSchema), createPost)
router.put('/:id', validate(updatePostSchema), updatePost)
router.patch('/:id', validate(updatePostSchema), updatePost)
router.delete('/:id', validate(Joi.object({ id: Joi.string().uuid().required() })), deletePost)

export default router
