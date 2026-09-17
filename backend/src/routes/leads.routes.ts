import { Hono } from "hono";
import { handleCreateLead } from "../controllers/leads.controller";
import { verifyTurnstile } from "../middlewares/turnstile";
import { Bindings } from "../types";

export const leadsRouter = new Hono<{ Bindings: Bindings }>();

leadsRouter.post("/", verifyTurnstile, handleCreateLead);
