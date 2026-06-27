import nodemailer from "nodemailer";

const hasSmtpConfig = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const createTransporter = () => {
  if (!hasSmtpConfig) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  const from = process.env.MAIL_FROM || "TalentBridge <no-reply@talentbridge.local>";

  if (!transporter) {
    console.log("[email preview]", { from, to, subject, html });
    return;
  }

  await transporter.sendMail({ from, to, subject, html });
};

