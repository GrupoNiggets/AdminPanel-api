import { Router } from 'express'
import Joi from 'joi'
import {
  listMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage
} from '../../modules/chat/chat.index.js'
import { createMessageSchema, updateMessageSchema } from '../../modules/chat/chat.validator.js'

const router = Router()

function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.validate(req.body, { abortEarly: false, stripUnknown: true })
    if (result.error) {
      const details = result.error.details.map(d => d.message)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos', details } })
    }
    req.body = result.value
    next()
  }
}

function validateParams(schema) {
  return (req, res, next) => {
    const result = schema.validate(req.params, { abortEarly: false, stripUnknown: true })
    if (result.error) {
      const details = result.error.details.map(d => d.message)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos', details } })
    }
    req.params = result.value
    next()
  }
}

const idSchema = Joi.object({ id: Joi.string().uuid().required() })

/**
 * @swagger
 * /v1/chat:
 *   get:
 *     summary: Obtener lista de mensajes
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Lista de mensajes obtenida exitosamente
 */
router.get('/', listMessages)

/**
 * @swagger
 * /v1/chat/{id}:
 *   get:
 *     summary: Obtener un mensaje por ID
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del mensaje
 *     responses:
 *       200:
 *         description: Mensaje encontrado
 *       404:
 *         description: Mensaje no encontrado
 */
router.get('/:id', validateParams(idSchema), getMessage)

/**
 * @swagger
 * /v1/chat:
 *   post:
 *     summary: Crear un nuevo mensaje
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Mensaje creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', validateBody(createMessageSchema), createMessage)

/**
 * @swagger
 * /v1/chat/{id}:
 *   put:
 *     summary: Actualizar un mensaje completamente
 *     tags: [Chat]
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
 *         description: Mensaje actualizado exitosamente
 *       404:
 *         description: Mensaje no encontrado
 *   patch:
 *     summary: Actualizar un mensaje parcialmente
 *     tags: [Chat]
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
 *         description: Mensaje actualizado exitosamente
 *       404:
 *         description: Mensaje no encontrado
 */
router.put('/:id', validateParams(idSchema), validateBody(updateMessageSchema), updateMessage)
router.patch('/:id', validateParams(idSchema), validateBody(updateMessageSchema), updateMessage)

/**
 * @swagger
 * /v1/chat/{id}:
 *   delete:
 *     summary: Eliminar un mensaje
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Mensaje eliminado exitosamente
 *       404:
 *         description: Mensaje no encontrado
 */
router.delete('/:id', validateParams(idSchema), deleteMessage)

export default router

