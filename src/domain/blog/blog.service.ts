import { PostsRepository } from "../post/post.repository";
import { BlogsRepository } from "./blog.repository";
import { BlogInputModel } from "./dto/blog.input.dto";

export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async getAll() {
    const blogs = await this.blogsRepository.getAll();
    return blogs;
  }

  async getById(id: string) {
    const blog = await this.blogsRepository.getById(id);
    return blog;
  }

  async create(body: BlogInputModel) {
    const newBlog = await this.blogsRepository.create(body);
    return newBlog;
  }

  async update(id: string, body: BlogInputModel) {
    const updatedBlog = await this.blogsRepository.update(id, body);

    if (updatedBlog) {
      await this.postsRepository.updateBlogName(updatedBlog.id, updatedBlog.name);
    }

    return updatedBlog;
  }

  async remove(id: string) {
    const deletedBlog = await this.blogsRepository.remove(id);

    // a post can't exist without its blog
    if (deletedBlog) {
      await this.postsRepository.removeByBlogId(deletedBlog.id);
    }

    return deletedBlog;
  }
}
