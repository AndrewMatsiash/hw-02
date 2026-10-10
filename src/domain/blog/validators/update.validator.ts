import {
  descriptionValidation,
  nameValidation,
  websiteUrlValidation,
} from "./blog-input.validator";

export const updateBlogValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];
