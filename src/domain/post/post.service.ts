import { blogsService } from "../blog/blog.service";
import { PostInputModel } from "./dto/post.input.dto";
import { postsRepository } from "./post.repository";

export const postsService = {
  getAll: async () => {
    return postsRepository.getAll();
  },

  getById: async (id: string) => {
    return postsRepository.getById(id);
  },

  create: async (body: PostInputModel) => {
    const postBlog = await blogsService.getById(body.blogId);

    if (!postBlog) {
      return null;
    }

    return postsRepository.create({ body, blogName: postBlog.name });
  },

  update: async (id: string, body: PostInputModel) => {
    const blog = await blogsService.getById(body.blogId);

    if (!blog) {
      return null;
    }

    return postsRepository.update({
      id,
      body,
      blogName: blog.name,
    });
  },

  remove: async (id: string) => {
    return postsRepository.remove(id);
  },
};
