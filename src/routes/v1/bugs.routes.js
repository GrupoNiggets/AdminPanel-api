import { Router } from 'express'
import Joi from 'joi'
import {
    listBugs,
    getBug,
    createBug,
    updateBug,
    deleteBug
} from '../../modules/bugs/bugs.index.js'
import { createBugSchema, updateBugSchema } from '../../modules/bugs/bugs.validator.js'

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
 * /v1/bugs:
 *   get:
 *     summary: Obtener lista de bugs
 *     tags: [Bugs]
 *     responses:
 *       200:
 *         description: Lista de bugs obtenida exitosamente
 */
router.get('/', listBugs)

/**
 * @swagger
 * /v1/bugs/{id}:
 *   get:
 *     summary: Obtener un bug por ID
 *     tags: [Bugs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del bug
 *     responses:
 *       200:
 *         description: Bug encontrado
 *       404:
 *         description: Bug no encontrado
 */
router.get('/:id', validateParams(idSchema), getBug)

/**
 * @swagger
 * /v1/bugs:
 *   post:
 *     summary: Crear un nuevo bug
 *     tags: [Bugs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Bug creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', validateBody(createBugSchema), createBug)

/**
 * @swagger
 * /v1/bugs/{id}:
 *   put:
 *     summary: Actualizar un bug completamente
 *     tags: [Bugs]
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
 *         description: Bug actualizado exitosamente
 *       404:
 *         description: Bug no encontrado
 *   patch:
 *     summary: Actualizar un bug parcialmente
 *     tags: [Bugs]
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
 *         description: Bug actualizado exitosamente
 *       404:
 *         description: Bug no encontrado
 */
router.put('/:id', validateParams(idSchema), validateBody(updateBugSchema), updateBug)
router.patch('/:id', validateParams(idSchema), validateBody(updateBugSchema), updateBug)

/**
 * @swagger
 * /v1/bugs/{id}:
 *   delete:
 *     summary: Eliminar un bug
 *     tags: [Bugs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Bug eliminado exitosamente
 *       404:
 *         description: Bug no encontrado
 */
router.delete('/:id', validateParams(idSchema), deleteBug)

export default router
