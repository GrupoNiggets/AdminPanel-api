## Estructura de la arquitectura (Enterprise Express JS)

Esta guía explica cómo está organizada la API, el flujo de una petición y cómo extenderla creando nuevos módulos de forma consistente.

### Objetivos de la arquitectura
- Cohesión por dominio (feature-first): cada módulo encapsula rutas, controladores, servicios, repositorios, modelos y validaciones.
- Capas claras: routing → controller → service → repository → data-source.
- Transversalidades centralizadas: configuración, logging, middlewares (seguridad, errores), documentación.
- Versionado de API y estándares de respuesta/errores.

---

### Árbol de directorios

```
src/
  app.js               # Construcción de la app (loaders + swagger)
  server.js            # Arranque del servidor HTTP

  config/              # Configuración del runtime y logger
    index.js           # Variables de entorno y flags (isDev/isProd/...)
    logger.js          # Logger (Winston)

  loaders/             # Inicialización de framework y utilidades
    express.js         # Middlewares base, CORS, Helmet, RateLimit, rutas y errores
    swagger.js         # Setup de Swagger UI + OpenAPI

  middlewares/         # Middlewares transversales
    asyncHandler.js    # Wrapper para controlar errores async
    errorHandler.js    # Manejo de errores unificado
    notFound.js        # 404 handler

  routes/              # Enrutado de la API (versionado)
    index.js           # /api base, /health y montaje de /v1
    v1/
      index.js         # Agrupa rutas v1
      bugs.routes.js   # Rutas del módulo Bugs
      status.routes.js # Rutas del módulo Status
      chat.routes.js   # Rutas del módulo Chat
      posts.routes.js  # Rutas del módulo Posts
      users.routes.js  # Rutas del módulo Users
      

  modules/             # Módulos de dominio (BUGS)
    bugs/
      bugs.index.js
      bugs.model.js
      bugs.validator.js
  
  modules/             # Módulos de dominio (CHAT)
    chat/
      chat.index.js
      chat.model.js
      chat.validator.js

  modules/             # Módulos de dominio (POSTS)
    posts/
      post.index.js
      post.model.js
      post.validator.js    

  modules/             # Módulos de dominio (STATUS)
    status/
      status.index.js
      status.model.js
      status.validator.js

  modules/             # Módulos de dominio (USERS)
    users/
      user.index.js
      user.model.js
      user.validator.js

  utils/               # Utilidades transversales
    ApiResponse.js     # Helpers de respuesta (ok, created, noContent)
    AppError.js        # Tipos de error de aplicación

  docs/
    swagger.js         # Definición OpenAPI base
```

---

### Flujo de una petición
1. Cliente llama `HTTP → /api/...`.
2. `src/loaders/express.js` aplica middlewares de seguridad/utilidad (Helmet, CORS, JSON, rate-limit, compresión, logs dev).
3. `src/routes/index.js` enruta por versión (`/v1`) y módulos (p.ej. `/users`).
4. `*.routes.js` valida entrada (Joi) y delega en controlador.
5. Controlador llama al servicio (reglas de negocio).
6. Servicio usa repositorio (acceso a datos). Aquí se cambia de Map en memoria a DB real sin romper capas superiores.
7. Controlador responde con `ApiResponse` o lanza `AppError`.
8. `errorHandler` captura y formatea respuesta de error.

---

### Configuración y arranque
- `config/index.js`: centraliza variables de entorno (env, puerto, niveles de log, etc.).
- `config/logger.js`: crea un `winston` logger con formato JSON/console y metadatos.
- `app.js`: crea la app Express y monta Swagger.
- `server.js`: inicia el servidor HTTP y maneja `unhandledRejection`/`uncaughtException`.

Uso:
```bash
npm run dev   # desarrollo
npm start     # producción
```

Variables de entorno (con valores por defecto):
- `NODE_ENV` (development|production|test)
- `PORT` (3000)
- `APP_NAME` (adminpanel-api)
- `APP_URL` (http://localhost:3000)
- `LOG_LEVEL` (debug en dev, info en prod)

---

### Middlewares transversales
- Seguridad: `helmet`, `cors`, `express-rate-limit`, `compression`.
- Utilidad: `express.json`, `express.urlencoded`, `morgan` en no-prod.
- Errores: `notFoundHandler` para 404 y `errorHandler` para errores conocidos `AppError` e inesperados.

Errores de dominio (ejemplos):
```js
// utils/AppError.js
throw badRequest('Datos inválidos')
throw notFound('Recurso no encontrado')
throw unauthorized('Token inválido')
throw forbidden('Permiso denegado')
```

---

### Respuestas estándar
- `ok(res, data)` → 200
- `created(res, data)` → 201
- `noContent(res)` → 204

Ejemplo en controlador:
```js
const data = await userService.listUsers()
ok(res, data)
```

---

### Módulos de dominio
Cada módulo encapsula su propio stack:
- `*.validator.js`: esquemas Joi para validar entrada.
- `*.model.js`: mapeos y transformaciones de entidades (DTOs públicos).
- `*.repository.js`: acceso a datos (in-memory/DB/externos).
- `*.service.js`: reglas de negocio y orquestación.
- `*.controller.js`: capa HTTP fina que usa el servicio.
- `routes/*.routes.js`: rutas Express del módulo.

Ejemplo Users (resumen de responsabilidades):
- Validator asegura `name/email/role` válidos.
- Service evita duplicar emails y aplica reglas.
- Repository persiste (aquí con `Map`, sustituible por DB).
- Controller traduce HTTP ↔ dominio.

---

### Validación de entrada (Joi)
En rutas se usa un validador ligero que:
- Valida `req.body` en métodos de escritura y `req.params` en lectura/borrado.
- Hace `stripUnknown` y agrega mensajes detallados de error.

Ejemplo de esquema:
```js
// modules/users/user.validator.js
export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('admin', 'user').default('user')
})
```

---

### Sustituir persistencia por una base de datos
Para pasar de `Map` en memoria a DB (SQL/NoSQL):
1. Implementa un nuevo repositorio que cumpla la misma interfaz pública (`list`, `getById`, `getByEmail`, `create`, `update`, `remove`).
2. Inyéctalo en el `UserService` vía constructor.
3. No cambian controladores, servicios ni validaciones.

Pseudocódigo:
```js
class UserRepositoryPg { /* implementa los mismos métodos usando SQL */ }
const service = new UserService({ userRepository: new UserRepositoryPg(pool) })
```

---

### Cómo crear un nuevo módulo (paso a paso)
Supongamos un módulo `articles`:

1) Modelo y DTO:
```js
// src/modules/articles/article.model.js
export function toPublicArticle(a) {
  if (!a) return null
  const { id, title, body, authorId, createdAt, updatedAt } = a
  return { id, title, body, authorId, createdAt, updatedAt }
}
```

2) Validadores:
```js
// src/modules/articles/article.validator.js
import Joi from 'joi'
export const createArticleSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  body: Joi.string().min(1).required(),
  authorId: Joi.string().uuid().required()
})
export const updateArticleSchema = Joi.object({
  title: Joi.string().min(2).max(200),
  body: Joi.string().min(1)
}).min(1)
```

3) Repositorio (in-memory):
```js
// src/modules/articles/article.repository.js
import { randomUUID } from 'crypto'
const articles = new Map()
export class ArticleRepository {
  async list () { return Array.from(articles.values()) }
  async getById (id) { return articles.get(id) || null }
  async create (data) {
    const now = new Date()
    const id = randomUUID()
    const entity = { id, ...data, createdAt: now, updatedAt: now }
    articles.set(id, entity); return entity
  }
  async update (id, changes) {
    const existing = articles.get(id); if (!existing) return null
    const updated = { ...existing, ...changes, updatedAt: new Date() }
    articles.set(id, updated); return updated
  }
  async remove (id) { const existed = articles.get(id); articles.delete(id); return existed != null }
}
```

4) Servicio:
```js
// src/modules/articles/article.service.js
import { notFound, badRequest } from '../../utils/AppError.js'
import { toPublicArticle } from './article.model.js'
import { ArticleRepository } from './article.repository.js'

export class ArticleService {
  constructor (deps = {}) {
    this.articleRepository = deps.articleRepository || new ArticleRepository()
  }
  async listArticles () { return (await this.articleRepository.list()).map(toPublicArticle) }
  async getArticle (id) {
    const a = await this.articleRepository.getById(id)
    if (!a) throw notFound('Artículo no encontrado')
    return toPublicArticle(a)
  }
  async createArticle (payload) {
    if (!payload.title) throw badRequest('Falta título')
    const created = await this.articleRepository.create(payload)
    return toPublicArticle(created)
  }
  async updateArticle (id, payload) {
    const updated = await this.articleRepository.update(id, payload)
    if (!updated) throw notFound('Artículo no encontrado')
    return toPublicArticle(updated)
  }
  async deleteArticle (id) {
    const ok = await this.articleRepository.remove(id)
    if (!ok) throw notFound('Artículo no encontrado')
    return true
  }
}
```

5) Controlador:
```js
// src/modules/articles/article.controller.js
import { ok, created, noContent } from '../../utils/ApiResponse.js'
import { asyncHandler } from '../../middlewares/asyncHandler.js'
import { ArticleService } from './article.service.js'
const articleService = new ArticleService()
export const listArticles = asyncHandler(async (req, res) => ok(res, await articleService.listArticles()))
export const getArticle = asyncHandler(async (req, res) => ok(res, await articleService.getArticle(req.params.id)))
export const createArticle = asyncHandler(async (req, res) => created(res, await articleService.createArticle(req.body)))
export const updateArticle = asyncHandler(async (req, res) => ok(res, await articleService.updateArticle(req.params.id, req.body)))
export const deleteArticle = asyncHandler(async (req, res) => { await articleService.deleteArticle(req.params.id); noContent(res) })
```

6) Rutas:
```js
// src/routes/v1/articles.routes.js
import { Router } from 'express'
import Joi from 'joi'
import { listArticles, getArticle, createArticle, updateArticle, deleteArticle } from '../../modules/articles/article.controller.js'
import { createArticleSchema, updateArticleSchema } from '../../modules/articles/article.validator.js'
const router = Router()
function validate (schema) {
  return (req, res, next) => {
    const toValidate = ['GET','DELETE'].includes(req.method) ? req.params : req.body
    const { error, value } = schema.validate(toValidate, { abortEarly:false, stripUnknown:true })
    if (error) return res.status(400).json({ success:false, error:{ code:'VALIDATION_ERROR', message:'Datos inválidos', details:error.details.map(d=>d.message) } })
    if (['POST','PUT','PATCH'].includes(req.method)) req.body = value; else req.params = value
    next()
  }
}
router.get('/', listArticles)
router.get('/:id', validate(Joi.object({ id: Joi.string().uuid().required() })), getArticle)
router.post('/', validate(createArticleSchema), createArticle)
router.put('/:id', validate(Joi.object({ id: Joi.string().uuid().required() })), validate(updateArticleSchema), updateArticle)
router.delete('/:id', validate(Joi.object({ id: Joi.string().uuid().required() })), deleteArticle)
export default router
```

7) Montaje en `v1`:
```js
// src/routes/v1/index.js
import { Router } from 'express'
import usersRoutes from './users.routes.js'
import articlesRoutes from './articles.routes.js'
const router = Router()
router.use('/users', usersRoutes)
router.use('/articles', articlesRoutes)
export default router
```

---

### Versionado de API
- `routes/index.js` expone `/api/health` y monta `/api/v1`.
- Cada nueva versión va en su propio directorio (`routes/v2`, etc.).

---

### Documentación (Swagger)
- Definición base en `docs/swagger.js` (OpenAPI 3).
- Montaje de UI en `/api/docs`.
- Amplía `schemas` y, si lo deseas, añade anotaciones JSDoc para generar paths automáticamente.

---

### Logging
- `config/logger.js` gestiona formato con timestamp, metadatos de servicio/entorno y stack de errores.
- Nivel configurable por entorno (`LOG_LEVEL`).

Uso:
```js
import { logger } from '../config/logger.js'
logger.info('Algo informativo', { contexto: 'extra' })
logger.error('Algo falló', { err })
```

---

### Pruebas rápidas (curl)
```bash
# Lista usuarios
curl -s http://localhost:3000/api/v1/users | jq

# Crea usuario
curl -s -X POST http://localhost:3000/api/v1/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","role":"admin"}' | jq

# Actualiza
curl -s -X PUT http://localhost:3000/api/v1/users/<id> \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada L."}' | jq

# Elimina
curl -s -X DELETE http://localhost:3000/api/v1/users/<id> -i

# Docs
open http://localhost:3000/api/docs
```

---

### Buenas prácticas y recomendaciones
- Mantén los controladores delgados; pon la lógica en servicios.
- Evita acceder a datos desde controladores; usa repositorios a través de servicios.
- Valida siempre la entrada con Joi en las rutas.
- Emplea `AppError` para errores de dominio y deja el resto al `errorHandler`.
- Aísla dependencias externas en repositorios (cambiables sin romper el dominio).


