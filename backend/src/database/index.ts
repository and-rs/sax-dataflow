import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { getDatabaseConfig } from "./config";
import * as schema from "./schema";
import path = require("path");

let db: ReturnType<typeof drizzle> | null = null;

async function initializeDatabase() {
  if (!db) {
    const { url, ssl } = await getDatabaseConfig();

    try {
      const pool = new Pool({
        connectionString: url,
        ssl,
      });

      db = drizzle({ client: pool, schema });
      await migrate(db, { migrationsFolder: path.join(__dirname, "drizzle") });

      console.log("DATABASE IS SET UP");
    } catch (error) {
      console.error("ERROR INITIALIZING DATABASE:", error);
      db = null;
      throw error;
    }
  }
  return db;
}

async function getDatabase(): Promise<ReturnType<typeof drizzle>> {
  if (!db) {
    return initializeDatabase();
  }
  return db;
}

export { getDatabase };
