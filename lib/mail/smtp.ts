import nodemailer from "nodemailer";
import { getAppUrl } from "@/lib/auth/config";

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) return null;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = (process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";
  const user = process.env.SMTP_USER?.trim() ?? "";
  const pass = process.env.SMTP_PASS ?? "";
  const from = process.env.SMTP_FROM?.trim() || "Forge Starter <noreply@localhost>";
  return { host, port: Number.isFinite(port) ? port : 587, secure, user, pass, from };
}

export function isSmtpConfigured() {
  return getSmtpConfig() !== null;
}

export async function sendMail(input: { to: string; subject: string; text: string; html?: string }) {
  const config = getSmtpConfig();
  if (!config) {
    throw new Error("SMTP is not configured");
  }
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.user ? { user: config.user, pass: config.pass } : undefined,
  });
  await transporter.sendMail({
    from: config.from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html ?? input.text.replace(/\n/g, "<br/>"),
  });
}

export async function sendPasswordResetEmail(input: { to: string; displayName: string; token: string }) {
  const resetUrl = `${getAppUrl()}/reset-password/?token=${encodeURIComponent(input.token)}`;
  const subject = "重置你的 Forge Starter 密码";
  const text = [
    `你好 ${input.displayName}，`,
    "",
    "我们收到了重置密码的请求。请在 1 小时内打开以下链接：",
    resetUrl,
    "",
    "如果不是你本人操作，请忽略本邮件。",
  ].join("\n");

  const config = getSmtpConfig();
  if (!config) {
    console.info("[forge-starter] SMTP not configured; password reset link:", resetUrl);
    return { delivered: false as const, resetUrl };
  }
  await sendMail({ to: input.to, subject, text });
  return { delivered: true as const, resetUrl };
}
