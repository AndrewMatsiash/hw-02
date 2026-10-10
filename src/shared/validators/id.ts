import { param } from "express-validator";

export const idValidation = param("id")
  .exists()
  .withMessage("Id is required")
  .isString()
  .withMessage("Id must be a string")
  .isNumeric()
  .withMessage("ID must be a numeric string");
