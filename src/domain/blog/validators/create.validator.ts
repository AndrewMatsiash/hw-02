import {
  descriptionValidation,
  nameValidation,
  websiteUrlValidation,
} from "./blog-input.validator";

export const createBlogValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];
