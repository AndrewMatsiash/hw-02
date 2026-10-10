import { Router, type Request, type Response } from "express";
import { HTTP_STATUSES } from "../../core/http/http-statuses";
import { blogsRepository } from "../blog/blog.repository";
import { postsRepository } from "../post/post.repository";

export const testRouter = Router({});

testRouter.delete(`/all-data`, (_: Request, res: Response) => {
  blogsRepository.clearAll();
  postsRepository.clearAll();
  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
});
