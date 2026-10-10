import { Router } from "express";
import { basicAuthGuard } from "../../core/middlewares/auth/basic-auth.guard";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { postsController } from "./post.controller";
import { createPostValidation } from "./validators/create.validator";
import { updatePostValidation } from "./validators/update.validator";

export const postsRouter = Router();

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
