import {
  blogIdValidation,
  contentValidation,
  shortDescriptionValidation,
  titleValidation,
} from "./post-input.validator";

export const createPostValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];
