import {
  blogIdValidation,
  contentValidation,
  shortDescriptionValidation,
  titleValidation,
} from "./post-input.validator";

export const updatePostValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];
