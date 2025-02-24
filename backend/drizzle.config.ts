import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const isDev = process.env.NODE_ENV === "dev";

let url: string;

if (isDev) {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const database = process.env.DB_NAME;
  const username = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;

  if (!host || !port || !database || !username || !password) {
    throw new Error(
      "Missing one or more database environment variables for development.",
    );
  }

  url = `postgresql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
} else {
  url = process.env.DATABASE_URL!;
  if (!url) {
    throw new Error(
      "DATABASE_URL environment variable must be set in production.",
    );
  }
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
