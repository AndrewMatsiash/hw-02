import type { Db } from "mongodb";
import { BLOG_COLLECTION_NAME, POST_COLLECTION_NAME } from "./db/collection";
import { BlogsController } from "./domain/blog/blog.controller";
import { BlogsRepository } from "./domain/blog/blog.repository";
import { createBlogsRouter } from "./domain/blog/blog.router";
import { BlogsService } from "./domain/blog/blog.service";
import { BlogViewModel } from "./domain/blog/types/blog.types";
import { PostsController } from "./domain/post/post.controller";
import { PostsRepository } from "./domain/post/post.repository";
import { createPostsRouter } from "./domain/post/post.router";
import { PostsService } from "./domain/post/post.service";
import { PostViewModel } from "./domain/post/types/post.types";
import { createTestRouter } from "./domain/test/test.route";

export const createApplicationDependencies = (db: Db) => {
  const blogsRepository = new BlogsRepository(
    db.collection<BlogViewModel>(BLOG_COLLECTION_NAME),
  );
  const postsRepository = new PostsRepository(
    db.collection<PostViewModel>(POST_COLLECTION_NAME),
  );

  const blogsService = new BlogsService(blogsRepository, postsRepository);
  const blogsController = new BlogsController(blogsService);
  const blogsRouter = createBlogsRouter(blogsController);

  const postsService = new PostsService(postsRepository, blogsService);
  const postsController = new PostsController(postsService);
  const postsRouter = createPostsRouter(postsController, blogsRepository);
  const testRouter = createTestRouter(blogsRepository, postsRepository);

  return { blogsRouter, postsRouter, testRouter };
};
