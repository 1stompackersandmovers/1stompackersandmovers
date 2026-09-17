import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema/leads";

export const createDbClient = (d1: D1Database) => {
  return drizzle(d1, { schema });
};
