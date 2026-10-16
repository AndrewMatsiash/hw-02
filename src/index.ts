import express from "express";
import { bootstrap } from "./bootstrap";
import { runDB } from "./db/mongo.db";
import { SETTINGS } from "./settings/config";

async function start() {
  await runDB(SETTINGS.DB_URL);
  const app = express();
  
  bootstrap(app);

  app.listen(SETTINGS.PORT, "0.0.0.0", () => {
    console.log(`App listening on port ${SETTINGS.PORT}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
