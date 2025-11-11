export function notFoundHandler (req, res) {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Recurso no encontrado' }
  })
}

export default notFoundHandler


