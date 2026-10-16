import express, { Express } from "express";
import { apiRouter } from "./base.router";
import { HTTP_STATUSES } from "./core/http/http-statuses";
import { errorHandler } from "./core/middlewares/error/error.handler";
import { ROUTES } from "./shared/routes";

export const bootstrap = (app: Express) => {
  app.use(express.json());

  app.use(ROUTES.base, apiRouter);

  app.get(ROUTES.base, (_, res) => {
    res.status(HTTP_STATUSES.OK).send("Hello world!");
  });

  app.use(errorHandler);

  return app;
};
