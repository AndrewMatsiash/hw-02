import express, { type Express } from "express";
import type { Db } from "mongodb";
import { bootstrap } from "./bootstrap";
import { createApplicationDependencies } from "./composition-root";

export const createApp = (db: Db): Express => {
  const { blogsRouter, postsRouter, testRouter } = createApplicationDependencies(db);
  return bootstrap(express(), blogsRouter, postsRouter, testRouter);
};
