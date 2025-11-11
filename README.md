## AdminPanel API (Express JS - Enterprise)

Arquitectura modular, validaciones con Joi, logging con Winston, middlewares de seguridad, documentación Swagger y ejemplo de módulo `users`.

### Requisitos
- Node.js 18+

### Instalación
```bash
npm install
```

### Variables de entorno
Configura variables (o usa valores por defecto):
- `NODE_ENV` (development | production | test) — default: development
- `PORT` — default: 3000
- `LOG_LEVEL` — default: info (prod) / debug (dev)
- `APP_NAME` — default: adminpanel-api
- `APP_URL` — default: http://localhost:3000

Puedes crear un archivo `.env` en la raíz con estos valores.

### Ejecutar
```bash
npm run dev
# o
npm start
```

### Endpoints base
- Salud: `GET /api/health`
- Swagger UI: `GET /api/docs`
- Users:
  - `GET /api/v1/users`
  - `GET /api/v1/users/:id`
  - `POST /api/v1/users`
  - `PUT /api/v1/users/:id`
  - `DELETE /api/v1/users/:id`

### Estructura del proyecto
```
src/
  app.js
  server.js
  config/
    index.js
    logger.js
  loaders/
    express.js
    swagger.js
  middlewares/
    asyncHandler.js
    errorHandler.js
    notFound.js
  routes/
    index.js
    v1/
      index.js
      users.routes.js
  modules/
    users/
      user.controller.js
      user.service.js
      user.repository.js
      user.model.js
      user.validator.js
  utils/
    ApiResponse.js
    AppError.js
  docs/
    swagger.js
```

### Notas
- El repositorio de `users` es en memoria (Map). Sustituir por una capa de persistencia (SQL/NoSQL) sin cambiar controladores/servicios.
- Las validaciones usan Joi con un validador ligero en rutas.
- Seguridad: Helmet, rate limit, CORS, JSON parser limitado y compresión.


