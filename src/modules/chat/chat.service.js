import { notFound } from '../../utils/AppError.js'
import { toPublicMessageWithUser } from './chat.model.js'
import { ChatRepository } from './chat.repository.js'
import { UserRepository } from '../users/user.repository.js'

export class ChatService {
  constructor (deps = {}) {
    this.chatRepository = deps.chatRepository || new ChatRepository()
    this.userRepository = deps.userRepository || new UserRepository()
  }

  async listMessages () {
    const items = await this.chatRepository.list()
    // enriquecemos con user público cuando sea necesario
    const results = await Promise.all(items.map((i) => toPublicMessageWithUser(i)))
    return results
  }

  async getMessage (id) {
    const msg = await this.chatRepository.getById(id)
    if (!msg) throw notFound('Mensaje no encontrado')
    return toPublicMessageWithUser(msg)
  }

  async createMessage (payload) {
    // validar que user exista
    const user = await this.userRepository.getById(payload.userId)
    if (!user) throw notFound('Usuario asociado no encontrado')
    const created = await this.chatRepository.create(payload)
    return toPublicMessageWithUser(created)
  }

  async updateMessage (id, payload) {
    const updated = await this.chatRepository.update(id, payload)
    if (!updated) throw notFound('Mensaje no encontrado')
    return toPublicMessageWithUser(updated)
  }

  async deleteMessage (id) {
    const ok = await this.chatRepository.remove(id)
    if (!ok) throw notFound('Mensaje no encontrado')
    return true
  }
}

export default ChatService
