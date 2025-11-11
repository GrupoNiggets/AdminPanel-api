export const postFields = {
  postId: 'string',
  userId: 'string',
  content: 'string',
  coordinates: 'geojson',
  createdAt: 'date',
  updatedAt: 'date'
}

export function toPublicPost (post) {
  if (!post) return null
  const { postId, userId, content, coordinates, createdAt, updatedAt } = post
  return { postId, userId, content, coordinates, createdAt, updatedAt }
}

export default { postFields, toPublicPost }


