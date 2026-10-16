import type { ErrorRequestHandler } from "express";
import { HTTP_STATUSES } from "../../http/http-statuses";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
};
