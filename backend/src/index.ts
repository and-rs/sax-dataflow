import { serve } from "@hono/node-server";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getDatabase } from "./database";
import { usersTable } from "./database/schema";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const db = await getDatabase();

    const user: typeof usersTable.$inferInsert = {
      name: "John",
      age: 30,
      email: "john@example.com",
    };

    await db.insert(usersTable).values(user);
    console.log("New user created!");

    const users = await db.select().from(usersTable);
    console.log("Getting all users from the database: ", users);

    await db
      .update(usersTable)
      .set({
        age: 31,
      })
      .where(eq(usersTable.email, user.email));
    console.log("User info updated!");

    await db.delete(usersTable).where(eq(usersTable.email, user.email));
    console.log("User deleted!");

    return c.json({});
  } catch (error) {
    const { name, message } = error as Error;
    console.error("Error:", error);
    return c.json({ message, name });
  }
});

if (process.env.NODE_ENV === "dev") {
  const PORT = 3001;
  serve({ port: PORT, fetch: app.fetch }, (info) => {
    console.log(`app is listening at http://localhost/${info.port}`);
  });
}

export default app;
