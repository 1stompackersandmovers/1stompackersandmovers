import { NewLead } from "../db/schema/leads";

export const sendLeadNotificationEmail = async (
  lead: NewLead,
  apiKey?: string,
  recipientEmail?: string
): Promise<boolean> => {
  if (!apiKey || !recipientEmail) {
    console.warn("Brevo API key or notification recipient email not set. Skipping email dispatch.");
    return false;
  }

  const payload = {
    sender: { name: "1st Om Packers System", email: "alerts@1stompackersandmovers.com" },
    to: [{ email: recipientEmail }],
    subject: `New Moving Inquiry: ${lead.name} (${lead.movingFrom} to ${lead.movingTo})`,
    htmlContent: `
      <h2>New Relocation Request Received</h2>
      <p><strong>Customer Name:</strong> ${lead.name}</p>
      <p><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>
      <p><strong>Email:</strong> ${lead.email || "Not provided"}</p>
      <hr/>
      <p><strong>Moving From:</strong> ${lead.movingFrom}</p>
      <p><strong>Moving To:</strong> ${lead.movingTo}</p>
      <p><strong>Move Type:</strong> ${lead.moveType}</p>
      <p><strong>Service Requested:</strong> ${lead.service}</p>
      <p><strong>Preferred Timeline:</strong> ${lead.timeline}</p>
    `,
  };

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Failed to send Brevo alert email:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Network error while calling Brevo API:", err);
    return false;
  }
};

export const sendOtpEmail = async (
  recipientEmail: string,
  otpCode: string,
  purpose: "2FA Login Verification" | "Password Reset" | "Account Verification" | string,
  apiKey?: string
): Promise<boolean> => {
  console.log(`\n========================================`);
  console.log(`🔐 Brevo OTP Dispatch`);
  console.log(`To: ${recipientEmail}`);
  console.log(`Purpose: ${purpose}`);
  console.log(`OTP Code: >>> ${otpCode} <<<`);
  console.log(`========================================\n`);

  if (!apiKey) {
    console.warn("⚠️ BREVO_API_KEY is not set. OTP has been logged to console for development testing.");
    return true; // Return true so flow continues seamlessly in local development
  }

  const subject = `[1st Om P&M Security] ${otpCode} is your ${purpose} code`;
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0f172a; font-size: 20px; font-weight: 700; margin: 0;">1st Om Packers & Movers</h1>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Admin Portal Security Verification</p>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <p style="color: #475569; font-size: 14px; margin: 0 0 12px 0;">Use the following one-time code for <strong>${purpose}</strong>:</p>
        <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #2563eb; padding: 12px 16px; background: #ffffff; border: 2px dashed #93c5fd; border-radius: 8px; display: inline-block; margin: 8px 0;">
          ${otpCode}
        </div>
        <p style="color: #94a3b8; font-size: 12px; margin: 12px 0 0 0;">This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>

      <div style="color: #64748b; font-size: 12px; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        <p style="margin: 0;">If you did not initiate this request, someone may be attempting to access your 1st Om Admin account. Please immediately review your account credentials.</p>
        <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 11px;">1st Om Packers and Movers Hub Central • Automated Security Service</p>
      </div>
    </div>
  `;

  const payload = {
    sender: { name: "1st Om Packers Security", email: "security@1stompackersandmovers.com" },
    to: [{ email: recipientEmail }],
    subject,
    htmlContent,
  };

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to send Brevo OTP email:", errText);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Network error while calling Brevo API for OTP:", err);
    return false;
  }
};
