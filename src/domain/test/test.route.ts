import { Router, type Request, type Response } from "express";
import { HTTP_STATUSES } from "../../core/http/http-statuses";
import { BlogsRepository } from "../blog/blog.repository";
import { PostsRepository } from "../post/post.repository";

export const createTestRouter = (
  blogsRepository: BlogsRepository,
  postsRepository: PostsRepository,
) => {
  const testRouter = Router({});

  testRouter.delete(`/all-data`, async (_: Request, res: Response) => {
    await blogsRepository.clearAll();
    await postsRepository.clearAll();
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  });

  return testRouter;
};
