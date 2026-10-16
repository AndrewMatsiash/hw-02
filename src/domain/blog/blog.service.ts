import { postsRepository } from "../post/post.repository";
import { blogsRepository } from "./blog.repository";
import { BlogInputModel } from "./dto/blog.input.dto";
import { BlogViewModel } from "./types/blog.types";

export const blogsService = {
  getAll: async () => {
    const blogs = await blogsRepository.getAll();
    return blogs;
  },

  getById: async (id: string) => {
    const blog = await blogsRepository.getById(id);
    return blog;
  },

  create: async (body: BlogInputModel) => {
    const newBlog = await blogsRepository.create(body);
    return newBlog;
  },

  update: async (id: string, body: BlogInputModel) => {
    const updatedBlog = await blogsRepository.update(id, body);

    if (updatedBlog) {
      postsRepository.updateBlogName(updatedBlog.id, updatedBlog.name);
    }

    return updatedBlog;
  },

  remove: async (id: string) => {
    const deletedBlog = await blogsRepository.remove(id);

    // a post can't exist without its blog
    if (deletedBlog) {
      postsRepository.removeByBlogId(deletedBlog.id);
    }

    return deletedBlog;
  },
};
