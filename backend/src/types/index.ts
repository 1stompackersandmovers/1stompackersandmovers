export interface Bindings {
  DB: D1Database;
  ENVIRONMENT?: string;
  BREVO_API_KEY?: string;
  NOTIFICATION_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

export type LeadStatus = "new" | "contacted" | "converted" | "lost";
