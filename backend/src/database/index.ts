import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDatabaseConfig } from "./config";

let db: ReturnType<typeof drizzle> | null = null;

async function initializeDatabase() {
  if (!db) {
    const { url, ssl } = await getDatabaseConfig();

    try {
      const pool = new Pool({
        connectionString: url,
        ssl,
      });

      db = drizzle({ client: pool });
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
