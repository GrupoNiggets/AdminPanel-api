//RESPUESTAS DE LA API
//FUNCIÓN ok (TODO CORRECTO)
export function ok(res, data, meta) {
  res.status(200).json({ success: true, data, meta });
}

//FUNCIÓN created (SE CREA CORRECTAMENTE)
export function created(res, data, meta) {
  res.status(201).json({ success: true, data, meta });
}

//FUNCIÓN noContent (NO TIENE CONTENIDO)
export function noContent(res) {
  res.status(204).send();
}

export default { ok, created, noContent };
