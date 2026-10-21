/// <reference types="jest" />

import { SETTINGS } from "./src/settings/config";
import { createApp } from "./src/app";
import { MongoDatabase } from "./src/db/mongo.db";
import { setTestApp } from "./src/testing/test-app";

const testDatabase = new MongoDatabase(SETTINGS.DB_URL, SETTINGS.DB_NAME);

beforeAll(async () => {
  await testDatabase.connect();
  setTestApp(createApp(testDatabase.getDb()));
});

afterAll(async () => {
  await testDatabase.close();
});
