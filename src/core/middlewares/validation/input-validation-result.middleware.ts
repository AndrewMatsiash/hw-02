import type { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import { APIErrorResult, FieldError } from "../../api-error/types";
import { HTTP_STATUSES } from "../../http/http-statuses";

const formatErrors = (error: ValidationError): FieldError => {
  if (error.type === "field") {
    return {
      field: error.path,
      message: error.msg,
    };
  }

  return { field: "", message: error.msg };
};

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  if (errors.length > 0) {
    const body: APIErrorResult = { errorsMessages: errors };
    return res.status(HTTP_STATUSES.BAD_REQUEST).json(body);
  }

  next();
};
