import { eq, desc, or } from "drizzle-orm";
import { getDb } from "../db/client";
import { admins, quotations, jobs, invoices, bilties, leads, companySettings } from "../db/schema";
import { hashPassword, verifyPassword } from "../utils/crypto";
import { releaseJobResources } from "./operations.service";
import { Bindings } from "../types";

// ================= AUTH & PROFILE ================= //

export const ensureAdminColumns = async (env: Bindings) => {
  try {
    const db = env.DB;
    const info = await db.prepare("PRAGMA table_info(admins)").all();
    const existingColumns = new Set((info.results || []).map((r: any) => r.name));

    if (!existingColumns.has("email")) {
      await db.prepare("ALTER TABLE admins ADD COLUMN email TEXT").run();
    }
    if (!existingColumns.has("two_factor_enabled")) {
      await db.prepare("ALTER TABLE admins ADD COLUMN two_factor_enabled INTEGER DEFAULT 0 NOT NULL").run();
    }
    if (!existingColumns.has("otp_code")) {
      await db.prepare("ALTER TABLE admins ADD COLUMN otp_code TEXT").run();
    }
    if (!existingColumns.has("otp_expires_at")) {
      await db.prepare("ALTER TABLE admins ADD COLUMN otp_expires_at TEXT").run();
    }
    if (!existingColumns.has("otp_purpose")) {
      await db.prepare("ALTER TABLE admins ADD COLUMN otp_purpose TEXT").run();
    }
    if (!existingColumns.has("updated_at")) {
      await db.prepare("ALTER TABLE admins ADD COLUMN updated_at TEXT").run();
    }
  } catch (e) {
    console.error("ensureAdminColumns check error:", e);
  }
};

export const getAdminByUsername = async (env: Bindings, username: string) => {
  await ensureAdminColumns(env);
  const db = getDb(env.DB);
  const result = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
  return result[0] || null;
};

export const getAdminById = async (env: Bindings, id: number) => {
  await ensureAdminColumns(env);
  const db = getDb(env.DB);
  const result = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
  return result[0] || null;
};

export const getFirstAdmin = async (env: Bindings) => {
  await ensureAdminColumns(env);
  const db = getDb(env.DB);
  const result = await db.select().from(admins).limit(1);
  return result[0] || null;
};

export const getAdminByEmailOrUsername = async (env: Bindings, identifier: string) => {
  await ensureAdminColumns(env);
  const db = getDb(env.DB);
  const result = await db
    .select()
    .from(admins)
    .where(or(eq(admins.username, identifier), eq(admins.email, identifier)))
    .limit(1);
  return result[0] || null;
};

export const getAdminCount = async (env: Bindings) => {
  await ensureAdminColumns(env);
  const db = getDb(env.DB);
  const list = await db.select({ id: admins.id }).from(admins);
  return list.length;
};

export const createAdminUser = async (
  env: Bindings,
  username: string,
  passwordPlain: string,
  email?: string
) => {
  await ensureAdminColumns(env);
  const db = getDb(env.DB);
  const { hash, salt } = await hashPassword(passwordPlain);
  const inserted = await db
    .insert(admins)
    .values({
      username,
      email: email || null,
      passwordHash: hash,
      salt,
      twoFactorEnabled: false,
    })
    .returning();
  return inserted[0];
};

export const verifyAdminLogin = async (env: Bindings, username: string, passwordPlain: string) => {
  await ensureAdminColumns(env);
  const admin = await getAdminByUsername(env, username);
  if (!admin) return null;

  const isValid = await verifyPassword(passwordPlain, admin.passwordHash, admin.salt);
  if (!isValid) return null;

  return admin;
};

export const updateAdminProfile = async (
  env: Bindings,
  adminId: number,
  data: { username?: string; email?: string }
) => {
  await ensureAdminColumns(env);
  const db = getDb(env.DB);
  const updated = await db
    .update(admins)
    .set({
      ...(data.username ? { username: data.username.trim() } : {}),
      ...(data.email !== undefined ? { email: data.email ? data.email.trim() : null } : {}),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(admins.id, adminId))
    .returning();
  return updated[0];
};

export const updateAdminPassword = async (
  env: Bindings,
  adminId: number,
  newPasswordPlain: string
) => {
  await ensureAdminColumns(env);
  const db = getDb(env.DB);
  const { hash, salt } = await hashPassword(newPasswordPlain);
  const updated = await db
    .update(admins)
    .set({
      passwordHash: hash,
      salt,
      otpCode: null,
      otpExpiresAt: null,
      otpPurpose: null,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(admins.id, adminId))
    .returning();
  return updated[0];
};

export const toggleAdmin2FA = async (env: Bindings, adminId: number, enabled: boolean) => {
  await ensureAdminColumns(env);
  const db = getDb(env.DB);
  const updated = await db
    .update(admins)
    .set({
      twoFactorEnabled: enabled,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(admins.id, adminId))
    .returning();
  return updated[0];
};

export const generateAndStoreOtp = async (
  env: Bindings,
  adminId: number,
  purpose: string
): Promise<string> => {
  await ensureAdminColumns(env);
  const db = getDb(env.DB);
  // Generate random 6-digit numeric OTP code (100000 - 999999)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Valid for 10 minutes
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await db
    .update(admins)
    .set({
      otpCode: otp,
      otpExpiresAt: expiresAt,
      otpPurpose: purpose,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(admins.id, adminId));

  return otp;
};

export const verifyAdminOtp = async (
  env: Bindings,
  adminId: number,
  otpInput: string,
  purpose: string
): Promise<boolean> => {
  await ensureAdminColumns(env);
  const db = getDb(env.DB);
  const admin = await getAdminById(env, adminId);
  if (!admin || !admin.otpCode || !admin.otpExpiresAt) return false;

  // Check purpose
  if (admin.otpPurpose !== purpose) return false;

  // Check expiry
  const now = new Date();
  const expiry = new Date(admin.otpExpiresAt);
  if (now > expiry) return false;

  // Check code equality
  if (admin.otpCode.trim() !== otpInput.trim()) return false;

  // Clear OTP on successful validation
  await db
    .update(admins)
    .set({
      otpCode: null,
      otpExpiresAt: null,
      otpPurpose: null,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(admins.id, adminId));

  return true;
};


// ================= LEADS (ADMIN) ================= //

export const getAllLeads = async (env: Bindings, statusFilter?: string) => {
  const db = getDb(env.DB);
  if (statusFilter && statusFilter !== "all") {
    return await db
      .select()
      .from(leads)
      .where(eq(leads.status, statusFilter as never))
      .orderBy(desc(leads.createdAt));
  }
  return await db.select().from(leads).orderBy(desc(leads.createdAt));
};

export const getLeadById = async (env: Bindings, id: number) => {
  const db = getDb(env.DB);
  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result[0] || null;
};

export const updateLeadStatusAndNotes = async (
  env: Bindings,
  leadId: number,
  data: { status?: "new" | "contacted" | "converted" | "lost"; notes?: string }
) => {
  const db = getDb(env.DB);
  const updated = await db
    .update(leads)
    .set({
      ...(data.status ? { status: data.status } : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {}),
    })
    .where(eq(leads.id, leadId))
    .returning();
  return updated[0];
};

export const createManualLead = async (
  env: Bindings,
  data: {
    name: string;
    phone: string;
    movingFrom: string;
    movingTo: string;
    moveType: string;
    service: string;
    timeline: string;
    email?: string;
    notes?: string;
  }
) => {
  const db = getDb(env.DB);
  const inserted = await db
    .insert(leads)
    .values({
      name: data.name,
      phone: data.phone,
      movingFrom: data.movingFrom,
      movingTo: data.movingTo,
      moveType: data.moveType,
      service: data.service,
      timeline: data.timeline,
      email: data.email || null,
      notes: data.notes || "Added manually by admin",
      status: "new",
    })
    .returning();
  return inserted[0];
};

// ================= QUOTATIONS ================= //

const generateDocNumber = (prefix: string) => {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${dateStr}-${randomSuffix}`;
};

export const createQuotation = async (
  env: Bindings,
  data: {
    leadId?: number;
    customerName: string;
    customerPhone: string;
    movingFrom: string;
    movingTo: string;
    moveDate?: string;
    inventoryData?: string; // JSON string
    packagingCharges: number;
    transportCharges: number;
    loadingCharges: number;
    unloadingCharges: number;
    insuranceDeclaredValue?: number;
    insuranceRatePercent?: number;
    insuranceCharges?: number;
    otherCharges?: number;
    discount?: number;
    gstRate?: number;
    gstAmount?: number;
    totalAmount: number;
    validUntil?: string;
  }
) => {
  const db = getDb(env.DB);
  const quoteNumber = generateDocNumber("1OM-Q");

  const inserted = await db
    .insert(quotations)
    .values({
      quoteNumber,
      leadId: data.leadId || null,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      movingFrom: data.movingFrom,
      movingTo: data.movingTo,
      moveDate: data.moveDate || null,
      inventoryData: data.inventoryData || null,
      packagingCharges: data.packagingCharges || 0,
      transportCharges: data.transportCharges || 0,
      loadingCharges: data.loadingCharges || 0,
      unloadingCharges: data.unloadingCharges || 0,
      insuranceDeclaredValue: data.insuranceDeclaredValue || 0,
      insuranceRatePercent: data.insuranceRatePercent || 0,
      insuranceCharges: data.insuranceCharges || 0,
      otherCharges: data.otherCharges || 0,
      discount: data.discount || 0,
      gstRate: data.gstRate || 0,
      gstAmount: data.gstAmount || 0,
      totalAmount: data.totalAmount,
      validUntil: data.validUntil || null,
      status: "sent",
    })
    .returning();

  // If associated with a lead, update lead status to contacted
  if (data.leadId) {
    await db
      .update(leads)
      .set({ status: "contacted" })
      .where(eq(leads.id, data.leadId));
  }

  return inserted[0];
};

export const getAllQuotations = async (env: Bindings) => {
  const db = getDb(env.DB);
  return await db.select().from(quotations).orderBy(desc(quotations.createdAt));
};

export const getQuotationById = async (env: Bindings, id: number) => {
  const db = getDb(env.DB);
  const result = await db.select().from(quotations).where(eq(quotations.id, id)).limit(1);
  return result[0] || null;
};

export const updateQuotationStatus = async (
  env: Bindings,
  id: number,
  status: "draft" | "sent" | "accepted" | "rejected"
) => {
  const db = getDb(env.DB);
  const updated = await db
    .update(quotations)
    .set({ status })
    .where(eq(quotations.id, id))
    .returning();
  return updated[0];
};

// ================= JOBS ================= //

export const createJob = async (
  env: Bindings,
  data: {
    quoteId?: number;
    leadId?: number;
    customerName: string;
    customerPhone: string;
    pickupAddress: string;
    deliveryAddress: string;
    scheduledDate: string;
    scheduledTime?: string;
    vehicleAssigned?: string;
    driverName?: string;
    driverPhone?: string;
    crewMembers?: string;
    specialNotes?: string;
  }
) => {
  const db = getDb(env.DB);
  const jobNumber = generateDocNumber("1OM-JOB");

  const inserted = await db
    .insert(jobs)
    .values({
      jobNumber,
      quoteId: data.quoteId || null,
      leadId: data.leadId || null,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      pickupAddress: data.pickupAddress,
      deliveryAddress: data.deliveryAddress,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime || null,
      vehicleAssigned: data.vehicleAssigned || null,
      driverName: data.driverName || null,
      driverPhone: data.driverPhone || null,
      crewMembers: data.crewMembers || null,
      specialNotes: data.specialNotes || null,
      status: "scheduled",
    })
    .returning();

  // If tied to quote, mark quote accepted
  if (data.quoteId) {
    await db
      .update(quotations)
      .set({ status: "accepted" })
      .where(eq(quotations.id, data.quoteId));
  }

  // If tied to lead, mark lead converted
  if (data.leadId) {
    await db
      .update(leads)
      .set({ status: "converted" })
      .where(eq(leads.id, data.leadId));
  }

  return inserted[0];
};

export const getAllJobs = async (env: Bindings) => {
  const db = getDb(env.DB);
  return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
};

export const getJobById = async (env: Bindings, id: number) => {
  const db = getDb(env.DB);
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result[0] || null;
};

export const updateJob = async (
  env: Bindings,
  id: number,
  data: Partial<typeof jobs.$inferInsert>
) => {
  const db = getDb(env.DB);
  const updated = await db
    .update(jobs)
    .set(data)
    .where(eq(jobs.id, id))
    .returning();

  if (data.status === "completed" || data.status === "cancelled") {
    await releaseJobResources(env, id);
  }

  return updated[0];
};

// ================= INVOICES ================= //

export const createInvoice = async (
  env: Bindings,
  data: {
    jobId?: number;
    quoteId?: number;
    customerName: string;
    customerPhone: string;
    customerGstin?: string;
    pickupAddress: string;
    deliveryAddress: string;
    sacCode?: string;
    subtotal: number;
    gstRate: number;
    gstAmount: number;
    totalAmount: number;
    advancePaid: number;
    balanceDue: number;
    paymentMode?: string;
  }
) => {
  const db = getDb(env.DB);
  const invoiceNumber = generateDocNumber("1OM-INV");
  const paymentStatus =
    data.balanceDue <= 0
      ? "paid"
      : data.advancePaid > 0
      ? "partial"
      : "unpaid";

  const inserted = await db
    .insert(invoices)
    .values({
      invoiceNumber,
      jobId: data.jobId || null,
      quoteId: data.quoteId || null,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerGstin: data.customerGstin || null,
      pickupAddress: data.pickupAddress,
      deliveryAddress: data.deliveryAddress,
      sacCode: data.sacCode || "9965",
      subtotal: data.subtotal,
      gstRate: data.gstRate || 0,
      gstAmount: data.gstAmount || 0,
      totalAmount: data.totalAmount,
      advancePaid: data.advancePaid || 0,
      balanceDue: data.balanceDue,
      paymentStatus,
      paymentMode: data.paymentMode || null,
    })
    .returning();

  return inserted[0];
};

export const getAllInvoices = async (env: Bindings) => {
  const db = getDb(env.DB);
  return await db.select().from(invoices).orderBy(desc(invoices.createdAt));
};

export const getInvoiceById = async (env: Bindings, id: number) => {
  const db = getDb(env.DB);
  const result = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
  return result[0] || null;
};

export const updateInvoicePayment = async (
  env: Bindings,
  id: number,
  data: { advancePaid: number; paymentMode?: string }
) => {
  const db = getDb(env.DB);
  const invoice = await getInvoiceById(env, id);
  if (!invoice) return null;

  const total = invoice.totalAmount;
  const advance = data.advancePaid;
  const balanceDue = Math.max(0, total - advance);
  const paymentStatus = balanceDue <= 0 ? "paid" : advance > 0 ? "partial" : "unpaid";

  const updated = await db
    .update(invoices)
    .set({
      advancePaid: advance,
      balanceDue,
      paymentStatus,
      paymentMode: data.paymentMode || invoice.paymentMode,
    })
    .where(eq(invoices.id, id))
    .returning();

  return updated[0];
};

// ================= BILTIES (LR) ================= //

export const createBilty = async (
  env: Bindings,
  data: {
    jobId?: number;
    consignorName: string;
    consignorAddress: string;
    consignorPhone: string;
    consigneeName: string;
    consigneeAddress: string;
    consigneePhone: string;
    fromCity: string;
    toCity: string;
    truckNumber: string;
    driverName: string;
    driverPhone: string;
    packagesCount: number;
    goodsDescription: string;
    declaredValue: number;
    freightAmount: number;
    freightStatus: "paid" | "to_pay";
    riskType: "owner_risk" | "carrier_risk";
  }
) => {
  const db = getDb(env.DB);
  const lrNumber = generateDocNumber("1OM-LR");

  const inserted = await db
    .insert(bilties)
    .values({
      lrNumber,
      jobId: data.jobId || null,
      consignorName: data.consignorName,
      consignorAddress: data.consignorAddress,
      consignorPhone: data.consignorPhone,
      consigneeName: data.consigneeName,
      consigneeAddress: data.consigneeAddress,
      consigneePhone: data.consigneePhone,
      fromCity: data.fromCity,
      toCity: data.toCity,
      truckNumber: data.truckNumber,
      driverName: data.driverName,
      driverPhone: data.driverPhone,
      packagesCount: data.packagesCount || 1,
      goodsDescription: data.goodsDescription,
      declaredValue: data.declaredValue || 0,
      freightAmount: data.freightAmount || 0,
      freightStatus: data.freightStatus || "to_pay",
      riskType: data.riskType || "owner_risk",
    })
    .returning();

  return inserted[0];
};

export const getAllBilties = async (env: Bindings) => {
  const db = getDb(env.DB);
  return await db.select().from(bilties).orderBy(desc(bilties.createdAt));
};

export const getBiltyById = async (env: Bindings, id: number) => {
  const db = getDb(env.DB);
  const result = await db.select().from(bilties).where(eq(bilties.id, id)).limit(1);
  return result[0] || null;
};

// ================= COMPANY SETTINGS (DATABASE PERSISTENCE) ================= //

export const ensureSettingsTable = async (env: Bindings) => {
  try {
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS company_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        data TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
  } catch (e) {
    console.error("ensureSettingsTable error:", e);
  }
};

export const getCompanySettings = async (env: Bindings) => {
  await ensureSettingsTable(env);
  const db = getDb(env.DB);
  const result = await db
    .select()
    .from(companySettings)
    .where(eq(companySettings.key, "company_config"))
    .limit(1);

  if (!result[0]) return null;
  try {
    return JSON.parse(result[0].data);
  } catch {
    return null;
  }
};

export const updateCompanySettings = async (env: Bindings, data: unknown) => {
  await ensureSettingsTable(env);
  const db = getDb(env.DB);
  const jsonString = JSON.stringify(data);
  const existing = await db
    .select()
    .from(companySettings)
    .where(eq(companySettings.key, "company_config"))
    .limit(1);

  if (existing[0]) {
    await db
      .update(companySettings)
      .set({
        data: jsonString,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(companySettings.key, "company_config"));
  } else {
    await db.insert(companySettings).values({
      key: "company_config",
      data: jsonString,
      updatedAt: new Date().toISOString(),
    });
  }

  return data;
};
