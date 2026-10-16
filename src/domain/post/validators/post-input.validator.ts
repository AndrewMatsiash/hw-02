// title*	string
// maxLength: 30
// shortDescription*	string
// maxLength: 100
// content*	string
// maxLength: 1000
// blogId*	string

import { body } from "express-validator";
import { blogsRepository } from "../../blog/blog.repository";

export const titleValidation = body("title")
  .isString()
  .withMessage("title must be a string")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("title length must be 1–30");

export const shortDescriptionValidation = body("shortDescription")
  .isString()
  .withMessage("shortDescription must be a string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("shortDescription length must be 1–100");

export const contentValidation = body("content")
  .isString()
  .withMessage("content must be a string")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("content length must be 1–1000");

export const blogIdValidation = body("blogId")
  .isString()
  .withMessage("blogId must be a string")
  .trim()
  .custom(async (blogId: string) => {
    const blog = await blogsRepository.getById(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
    return true;
  });
