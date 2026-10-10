import { blogsService } from "../blog/blog.service";
import { PostInputModel } from "./dto/post.input.dto";
import { postsRepository } from "./post.repository";
import { PostViewModel } from "./types/post.types";

export const postsService = {
  getAll: (): PostViewModel[] => {
    const posts = postsRepository.getAll();
    return posts;
  },
  getById: (id: string): PostViewModel | undefined => {
    const post = postsRepository.getById(id);
    return post;
  },
  create: (body: PostInputModel): PostViewModel => {
    const { blogId } = body;

    const postBlog = blogsService.getById(blogId);

    if (!postBlog) {
      throw new Error(`Blog ${blogId} not found`);
    }

    const newPost = postsRepository.create({ body, blogName: postBlog.name });

    return newPost;
  },

  update: (id: string, body: PostInputModel): PostViewModel | undefined => {
    const { blogId } = body;
    const blog = blogsService.getById(blogId);

    if (!blog) {
      throw new Error(`Blog with id: ${blogId} not found`);
    }

    const updatedPost = postsRepository.update({
      id,
      body,
      blogName: blog.name,
    });

    return updatedPost;
  },
  remove: (id: string): PostViewModel | undefined => {
    const deletedPost = postsRepository.remove(id);
    return deletedPost;
  },
};
