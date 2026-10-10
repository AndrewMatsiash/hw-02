import { Router } from "express";
import { blogsRouter } from "./domain/blog/blog.router";
import { postsRouter } from "./domain/post/post.router";
import { testRouter } from "./domain/test/test.route";
import { ROUTES } from "./shared/routes";

export const apiRouter = Router();

apiRouter.use(ROUTES.blogs, blogsRouter);
apiRouter.use(ROUTES.posts, postsRouter);
apiRouter.use(ROUTES.testing, testRouter);
