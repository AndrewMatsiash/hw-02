import { Db, MongoClient } from "mongodb";

export class MongoDatabase {
  private readonly client: MongoClient;
  private db: Db | null = null;

  constructor(
    url: string,
    private readonly databaseName: string,
  ) {
    this.client = new MongoClient(url);
  }

  async connect(): Promise<void> {
    if (this.db) {
      return;
    }

    await this.client.connect();

    const db = this.client.db(this.databaseName);
    await db.command({ ping: 1 });

    this.db = db;
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error("Database is not connected");
    }

    return this.db;
  }

  getClient() {
    return this.client;
  }

  async close() {
    if (!this.db) {
      return;
    }

    await this.client.close();
    this.db = null;
  }
}
