import { serve } from "@hono/node-server";
import { Hono } from "hono";

const PORT = 3001;
const app = new Hono();

app.get("/", (c) => {
  return c.text("testing");
});

serve({ port: PORT, fetch: app.fetch }, (info) => {
  console.log(`app is listening at http://localhost/${info.port}`);
});

export default app;
