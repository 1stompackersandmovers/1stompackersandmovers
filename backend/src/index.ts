import { Hono } from "hono";
import { cors } from "hono/cors";
import { leadsRouter } from "./routes/leads.routes";
import { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for frontend requests
app.use(
  "*",
  cors({
    origin: (origin) => origin || "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "1st-om-packers-api" });
});

// Mount routes
app.route("/api/leads", leadsRouter);

// Global 404 handler
app.notFound((c) => {
  return c.json({ error: "Endpoint not found" }, 404);
});

// Global error handler
app.onError((err, c) => {
  console.error("Unhandled Worker Exception:", err);
  return c.json({ error: "An unexpected error occurred" }, 500);
});

export default app;
