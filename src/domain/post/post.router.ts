import { Router } from "express";
import { basicAuthGuard } from "../../core/middlewares/auth/basic-auth.guard";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { PostsController } from "./post.controller";
import { createCreatePostValidation } from "./validators/create.validator";
import { createUpdatePostValidation } from "./validators/update.validator";
import { BlogsRepository } from "../blog/blog.repository";

export const createPostsRouter = (
  postsController: PostsController,
  blogsRepository: BlogsRepository,
) => {
  const postsRouter = Router();
  const createPostValidation = createCreatePostValidation(blogsRepository);
  const updatePostValidation = createUpdatePostValidation(blogsRepository);

  postsRouter
  .get("/", postsController.getAll)
  .get("/:id", postsController.getById)
  .post(
    "/",
    basicAuthGuard,
    createPostValidation,
    inputValidationResultMiddleware,
    postsController.create,
  )
  .put(
    "/:id",
    basicAuthGuard,
    updatePostValidation,
    inputValidationResultMiddleware,
    postsController.update,
  )
    .delete("/:id", basicAuthGuard, postsController.remove);

  return postsRouter;
};
