import { Hono } from "hono";

const app = new Hono();

const port = 3001;

const server = {
  port,
  fetch: app.fetch,
  host: "::",
};

export default server;
