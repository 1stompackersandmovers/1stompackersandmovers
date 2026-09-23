import { Context, Next } from "hono";
import { verify, sign } from "hono/jwt";
import { Bindings, AdminPayload } from "../types";

const DEFAULT_JWT_SECRET = "1st-om-packers-secret-key-change-in-prod-2026";

export const getJwtSecret = (env?: Bindings): string => {
  return env?.JWT_SECRET || DEFAULT_JWT_SECRET;
};

export const createToken = async (payload: AdminPayload, secret: string): Promise<string> => {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30-day mobile session
  return await sign({ ...payload, exp }, secret);
};

export const authMiddleware = async (c: Context<{ Bindings: Bindings }>, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized. Missing or invalid Bearer token." }, 401);
  }

  const token = authHeader.substring(7).trim();
  const secret = getJwtSecret(c.env);

  try {
    const payload = (await verify(token, secret, "HS256")) as unknown as AdminPayload;
    if (!payload || !payload.id) {
      return c.json({ error: "Unauthorized. Invalid token payload." }, 401);
    }
    c.set("admin" as never, payload as never);
    await next();
  } catch (err) {
    return c.json({ error: "Unauthorized. Token expired or invalid signature." }, 401);
  }
};
