import { BlogsRepository } from "../../blog/blog.repository";
import {
  createBlogIdValidation,
  contentValidation,
  shortDescriptionValidation,
  titleValidation,
} from "./post-input.validator";

export const createCreatePostValidation = (blogsRepository: BlogsRepository) => [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  createBlogIdValidation(blogsRepository),
];
