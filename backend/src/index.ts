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

// Geolocation endpoint
app.get("/api/geo", (c) => {
  const cf = (c.req.raw as unknown as { cf?: Record<string, unknown> })?.cf || {};
  return c.json({
    city: cf.city || "",
    region: cf.region || "",
    regionCode: cf.regionCode || "",
    country: cf.country || "",
    postalCode: cf.postalCode || "",
    latitude: cf.latitude || "",
    longitude: cf.longitude || "",
  });
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
