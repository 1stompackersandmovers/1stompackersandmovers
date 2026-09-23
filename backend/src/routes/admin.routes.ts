import { Hono } from "hono";
import {
  handleAdminLogin,
  handleAdminMe,
  handleGetLeads,
  handleUpdateLead,
  handleCreateManualLead,
  handleCreateQuotation,
  handleGetQuotations,
  handleGetQuotationById,
  handleUpdateQuotationStatus,
  handleCreateJob,
  handleGetJobs,
  handleGetJobById,
  handleUpdateJob,
  handleCreateInvoice,
  handleGetInvoices,
  handleGetInvoiceById,
  handleUpdateInvoicePayment,
  handleCreateBilty,
  handleGetBilties,
  handleGetBiltyById,
  handleGetSettings,
  handleUpdateSettings,
  handleVerify2FA,
  handleResend2FAOtp,
  handleForgotPasswordRequestOtp,
  handleForgotPasswordReset,
  handleGetAdminProfile,
  handleUpdateAdminProfile,
  handleChangePassword,
  handleToggle2FA,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth";
import { Bindings } from "../types";

export const adminRouter = new Hono<{ Bindings: Bindings }>();

// Public Auth routes
adminRouter.post("/auth/login", handleAdminLogin);
adminRouter.post("/auth/verify-2fa", handleVerify2FA);
adminRouter.post("/auth/resend-2fa-otp", handleResend2FAOtp);
adminRouter.post("/auth/forgot-password/request-otp", handleForgotPasswordRequestOtp);
adminRouter.post("/auth/forgot-password/reset", handleForgotPasswordReset);

// Protected routes (require Bearer JWT)
adminRouter.use("*", authMiddleware);

adminRouter.get("/auth/me", handleAdminMe);

// Admin Profile & Security
adminRouter.get("/profile", handleGetAdminProfile);
adminRouter.patch("/profile", handleUpdateAdminProfile);
adminRouter.patch("/change-password", handleChangePassword);
adminRouter.patch("/toggle-2fa", handleToggle2FA);

// Leads
adminRouter.get("/leads", handleGetLeads);
adminRouter.post("/leads/manual", handleCreateManualLead);
adminRouter.patch("/leads/:id", handleUpdateLead);

// Quotations
adminRouter.get("/quotes", handleGetQuotations);
adminRouter.post("/quotes", handleCreateQuotation);
adminRouter.get("/quotes/:id", handleGetQuotationById);
adminRouter.patch("/quotes/:id/status", handleUpdateQuotationStatus);

// Jobs
adminRouter.get("/jobs", handleGetJobs);
adminRouter.post("/jobs", handleCreateJob);
adminRouter.get("/jobs/:id", handleGetJobById);
adminRouter.patch("/jobs/:id", handleUpdateJob);

// Invoices
adminRouter.get("/invoices", handleGetInvoices);
adminRouter.post("/invoices", handleCreateInvoice);
adminRouter.get("/invoices/:id", handleGetInvoiceById);
adminRouter.patch("/invoices/:id/payment", handleUpdateInvoicePayment);

// Bilties
adminRouter.get("/bilties", handleGetBilties);
adminRouter.post("/bilties", handleCreateBilty);
adminRouter.get("/bilties/:id", handleGetBiltyById);

// Settings
adminRouter.get("/settings", handleGetSettings);
adminRouter.put("/settings", handleUpdateSettings);
