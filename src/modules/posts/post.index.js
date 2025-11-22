// IMPORTS
import { notFound } from "../../utils/AppError.js";
import { created, noContent, ok } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { PostModel } from "./post.mongoose.js";

// MODELO
// CAMPOS DE POST
export const postFields = {
  postId: "string",
  userId: "string",
  content: "string",
  coordinates: "geojson",
  createdAt: "date",
  updatedAt: "date",
};

// FUNCIÓN toPublicPost (DEVUELVE LOS CAMPOS DE FORMA SIMILAR A UN JSON)
export function toPublicPost(post) {
  if (!post) return null;
  const { postId, userId, content, coordinates, createdAt, updatedAt } = post;
  return { postId, userId, content, coordinates, createdAt, updatedAt };
}

// REPOSITORIO
//CLASE PostRepository
export class PostRepository {
  async list() {
    const docs = await PostModel.find({}).lean().exec();
    return docs;
  }

  //getById
  async getById(postId) {
    const doc = await PostModel.findOne({ postId }).lean().exec();
    return doc || null;
  }

  //create
  async create(data) {
    const created = await PostModel.create(data);
    return created.toObject();
  }

  //update
  async update(postId, changes) {
    const updated = await PostModel.findOneAndUpdate(
      { postId },
      { $set: changes },
      { new: true, lean: true }
    ).exec();
    return updated || null;
  }

  //remove
  async remove(postId) {
    const res = await PostModel.deleteOne({ postId }).exec();
    return res.deletedCount === 1;
  }
}

// SERVICIO
//CLASE PostService
export class PostService {
  constructor(deps = {}) {
    this.postRepository = deps.postRepository || new PostRepository();
  }

  //listPosts
  async listPosts() {
    const items = await this.postRepository.list();
    return items.map(toPublicPost);
  }

  //getPost
  async getPost(postId) {
    const post = await this.postRepository.getById(postId);
    if (!post) {
      throw notFound("Publicación no encontrada");
    }
    return toPublicPost(post);
  }

  //createPost
  async createPost(payload) {
    const created = await this.postRepository.create(payload);
    return toPublicPost(created);
  }

  //updatePost
  async updatePost(postId, payload) {
    const updated = await this.postRepository.update(postId, payload);
    if (!updated) {
      throw notFound("Publicación no encontrada");
    }
    return toPublicPost(updated);
  }

  //deletePost
  async deletePost(postId) {
    const ok = await this.postRepository.remove(postId);
    if (!ok) {
      throw notFound("Publicación no encontrada");
    }
    return true;
  }
}

// CONTROLADOR (HANDLERS)
//postService
const postService = new PostService();

export const listPosts = asyncHandler(async (req, res) => {
  const data = await postService.listPosts();
  ok(res, data);
});

//getPost
export const getPost = asyncHandler(async (req, res) => {
  const data = await postService.getPost(req.params.id);
  ok(res, data);
});

//createPost
export const createPost = asyncHandler(async (req, res) => {
  const data = await postService.createPost(req.body);
  created(res, data);
});

//updatePost
export const updatePost = asyncHandler(async (req, res) => {
  const data = await postService.updatePost(req.params.id, req.body);
  ok(res, data);
});

//deletePost
export const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.id);
  noContent(res);
});
