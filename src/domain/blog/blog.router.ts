import { Router } from "express";
import { basicAuthGuard } from "../../core/middlewares/auth/basic-auth.guard";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { blogsController } from "./blog.controller";
import { createBlogValidation } from "./validators/create.validator";
import { updateBlogValidation } from "./validators/update.validator";

export const blogsRouter = Router();

blogsRouter
  .get("/", blogsController.getAll)
  .get("/:id", blogsController.getById)
  .post(
    "/",
    basicAuthGuard,
    createBlogValidation,
    inputValidationResultMiddleware,
    blogsController.create,
  )
  .put(
    "/:id",
    basicAuthGuard,
    updateBlogValidation,
    inputValidationResultMiddleware,
    blogsController.update,
  )
  .delete("/:id", basicAuthGuard, blogsController.remove);
