import { BlogsService } from "../blog/blog.service";
import { PostInputModel } from "./dto/post.input.dto";
import { PostsRepository } from "./post.repository";

export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsService: BlogsService,
  ) {}

  async getAll() {
    return this.postsRepository.getAll();
  }

  async getById(id: string) {
    return this.postsRepository.getById(id);
  }

  async create(body: PostInputModel) {
    const postBlog = await this.blogsService.getById(body.blogId);

    if (!postBlog) {
      return null;
    }

    return this.postsRepository.create({ body, blogName: postBlog.name });
  }

  async update(id: string, body: PostInputModel) {
    const blog = await this.blogsService.getById(body.blogId);

    if (!blog) {
      return null;
    }

    return this.postsRepository.update({
      id,
      body,
      blogName: blog.name,
    });
  }

  async remove(id: string) {
    return this.postsRepository.remove(id);
  }
}
