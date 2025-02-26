import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import usersRoute from "./routes/users";

const app = new Hono();

app.get("/", (c) => {
  return c.text("whattt");
});

app.route("/users", usersRoute);

if (process.env.NODE_ENV === "dev") {
  const PORT = 3001;
  serve({ port: PORT, fetch: app.fetch }, (info) => {
    console.log(`app is listening at http://localhost/${info.port}`);
  });
}

export default app;
