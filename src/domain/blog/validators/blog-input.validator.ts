import { body } from "express-validator";

const WEBSITE_URL_PATTERN =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const nameValidation = body("name")
  .isString()
  .withMessage("name must be a string")
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("name length must be 1–15");

export const descriptionValidation = body("description")
  .isString()
  .withMessage("description must be a string")
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("description length must be 1–500");

export const websiteUrlValidation = body("websiteUrl")
  .isString()
  .withMessage("websiteUrl must be a string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("websiteUrl length must be 1–100")
  .matches(WEBSITE_URL_PATTERN)
  .withMessage("websiteUrl must be a valid https URL");
