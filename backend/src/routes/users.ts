import { Hono } from "hono";
import { usersTable } from "../database/schema";
import { getDatabase } from "../database/init";

const usersRoute = new Hono();

usersRoute.get("/", async (c) => {
  try {
    const db = await getDatabase();

    const user: typeof usersTable.$inferInsert = {
      email: "john@example.com",
      password: "xyz",
      username: "test",
    };

    await db.insert(usersTable).values(user);
    console.log("New user created!");

    const users = await db.select().from(usersTable);

    return c.json({ users });
  } catch (error) {
    const { name, message } = error as Error;

    console.error("Error:", error);

    return c.json({ message, name });
  }
});

usersRoute.post("/", (c) => c.text("Create User"));

export default usersRoute;
