import { toPublicUser } from '../users/user.model.js'
import { UserRepository } from '../users/user.repository.js'

const userRepo = new UserRepository()

export function toPublicMessage (msg) {
  if (!msg) return null
  const { id, messageId, content, userId, meta, createdAt, updatedAt } = msg
  return { id, messageId, content, userId, meta, createdAt, updatedAt }
}

// Enriquecer mensaje con info pública del usuario
export async function toPublicMessageWithUser (msg) {
  if (!msg) return null
  const base = toPublicMessage(msg)
  const user = await userRepo.getById(base.userId)
  base.user = toPublicUser(user)
  return base
}

export default { toPublicMessage, toPublicMessageWithUser }



