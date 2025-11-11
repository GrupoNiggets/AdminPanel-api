//IMPORTS
import { badRequest, notFound } from "../../utils/AppError.js";
import { toPublicUser } from "./user.model.js";
import { UserRepository } from "./user.repository.js";

export class UserService {
  constructor(deps = {}) {
    this.userRepository = deps.userRepository || new UserRepository();
  }

  //ASINCRONÍA listUsers (LISTAR USUARIOS)
  async listUsers() {
    const items = await this.userRepository.list();
    return items.map(toPublicUser);
  }

  //ASINCRONÍA getUser (CONSEGUIR USUARIO)
  async getUser(id) {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw notFound("Usuario no encontrado");
    }
    return toPublicUser(user);
  }

  //ASINCRONÍA createUser (CREAR USUARIO)
  async createUser(payload) {
    const existing = await this.userRepository.getByEmail(payload.email);
    if (existing) {
      throw badRequest("El email ya está en uso", "EMAIL_IN_USE");
    }
    const created = await this.userRepository.create(payload);
    return toPublicUser(created);
  }

  //ASINCRONÍA updateUser (ACTUALIZAR USUARIO)
  async updateUser(id, payload) {
    const updated = await this.userRepository.update(id, payload);
    if (!updated) {
      throw notFound("Usuario no encontrado");
    }
    return toPublicUser(updated);
  }

  //ASINCRONÍA deleteUser (ELIMINAR USUARIO)
  async deleteUser(id) {
    const ok = await this.userRepository.remove(id);
    if (!ok) {
      throw notFound("Usuario no encontrado");
    }
    return true;
  }
}

export default UserService;
