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
