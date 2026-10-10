import { postsRepository } from "../post/post.repository";
import { blogsRepository } from "./blog.repository";
import { BlogInputModel } from "./dto/blog.input.dto";
import { BlogViewModel } from "./types/blog.types";

export const blogsService = {
  getAll: (): BlogViewModel[] => {
    const blogs = blogsRepository.getAll();
    return blogs;
  },
  getById: (id: string): BlogViewModel | undefined => {
    const blog = blogsRepository.getById(id);
    return blog;
  },
  create: (body: BlogInputModel): BlogViewModel => {
    const newBlog = blogsRepository.create(body);
    return newBlog;
  },
  update: (id: string, body: BlogInputModel): BlogViewModel | undefined => {
    const updatedBlog = blogsRepository.update(id, body);

    // posts store a copy of blogName, so keep it in sync on rename
    if (updatedBlog) {
      postsRepository.updateBlogName(updatedBlog.id, updatedBlog.name);
    }

    return updatedBlog;
  },
  remove: (id: string): BlogViewModel | undefined => {
    const deletedBlog = blogsRepository.remove(id);

    // a post can't exist without its blog
    if (deletedBlog) {
      postsRepository.removeByBlogId(deletedBlog.id);
    }

    return deletedBlog;
  },
};
