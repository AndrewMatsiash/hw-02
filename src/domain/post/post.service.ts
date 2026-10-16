import { blogsService } from "../blog/blog.service";
import { PostInputModel } from "./dto/post.input.dto";
import { postsRepository } from "./post.repository";
import { PostViewModel } from "./types/post.types";

export const postsService = {
  getAll: async () => {
    const posts = await postsRepository.getAll();
    return posts;
  },

  getById: async (id: string) => {
    const post = await postsRepository.getById(id);
    return post;
  },

  create: async (body: PostInputModel) => {
    const { blogId } = body;

    const postBlog = await blogsService.getById(blogId);

    if (!postBlog) {
      throw new Error(`Blog ${blogId} not found`);
    }

    const newPost = await postsRepository.create({ body, blogName: postBlog.name });

    return newPost;
  },

  update: async (id: string, body: PostInputModel) => {
    const { blogId } = body;

    const blog = await blogsService.getById(blogId);

    if (!blog) {
      throw new Error(`Blog with id: ${blogId} not found`);
    }

    const updatedPost = await postsRepository.update({
      id,
      body,
      blogName: blog.name,
    });

    return updatedPost;
  },

  remove: async (id: string) => {
    const deletedPost = await postsRepository.remove(id);
    return deletedPost;
  },
};
