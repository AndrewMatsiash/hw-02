import type { Express } from "express";

let testApp: Express | null = null;

export const setTestApp = (app: Express) => {
  testApp = app;
};

export const getTestApp = (): Express => {
  if (!testApp) {
    throw new Error("Test application is not initialized");
  }

  return testApp;
};
