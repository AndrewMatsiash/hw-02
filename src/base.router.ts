import { Router, type Router as RouterType } from "express";
import { ROUTES } from "./shared/routes";

export const createApiRouter = (
  blogsRouter: RouterType,
  postsRouter: RouterType,
  testRouter: RouterType,
) => {
  const apiRouter = Router();

  apiRouter.use(ROUTES.blogs, blogsRouter);
  apiRouter.use(ROUTES.posts, postsRouter);
  apiRouter.use(ROUTES.testing, testRouter);

  return apiRouter;
};
