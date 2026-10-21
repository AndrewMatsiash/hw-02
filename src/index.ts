import { createApp } from "./app";
import { SETTINGS } from "./settings/config";
import { MongoDatabase } from "./db/mongo.db";

const database = new MongoDatabase(SETTINGS.DB_URL, SETTINGS.DB_NAME);

async function start() {
  await database.connect();
  const app = createApp(database.getDb());

  app.listen(SETTINGS.PORT, "0.0.0.0", () => {
    console.log(`App listening on port ${SETTINGS.PORT}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
