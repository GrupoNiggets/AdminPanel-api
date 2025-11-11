import { randomUUID } from 'crypto'

const users = new Map()

export class UserRepository {
  async list () {
    return Array.from(users.values())
  }

  async getById (id) {
    return users.get(id) || null
  }

  async getByEmail (email) {
    return Array.from(users.values()).find(u => u.email === email) || null
  }

  async create (data) {
    const now = new Date()
    const id = randomUUID()
    const entity = { id, ...data, createdAt: now, updatedAt: now }
    users.set(id, entity)
    return entity
  }

  async update (id, changes) {
    const existing = users.get(id)
    if (!existing) return null
    const updated = { ...existing, ...changes, updatedAt: new Date() }
    users.set(id, updated)
    return updated
  }

  async remove (id) {
    const existed = users.get(id)
    users.delete(id)
    return existed != null
  }
}

export default UserRepository


