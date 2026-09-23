import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const companySettings = sqliteTable("company_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique().default("company_config"),
  data: text("data").notNull(),
  updatedAt: text("updated_at")
    .default("CURRENT_TIMESTAMP")
    .notNull(),
});

export type CompanySettings = typeof companySettings.$inferSelect;
export type NewCompanySettings = typeof companySettings.$inferInsert;
