export function ok (res, data, meta) {
  res.status(200).json({ success: true, data, meta })
}

export function created (res, data, meta) {
  res.status(201).json({ success: true, data, meta })
}

export function noContent (res) {
  res.status(204).send()
}

export default { ok, created, noContent }


