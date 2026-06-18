const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const emailLogPath = process.env.VERCEL
  ? '/tmp/emails.log'
  : path.join(__dirname, '../../database/emails.log');

// Setup standard transport (can be customized via environment variables)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

function logEmailLocally(to, subject, text, html) {
  const logDir = path.dirname(emailLogPath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logEntry = `
========================================
[EMAIL SENT - ${new Date().toISOString()}]
TO: ${to}
SUBJECT: ${subject}
TEXT: ${text}
----------------------------------------
${html}
========================================
\n`;

  fs.appendFileSync(emailLogPath, logEntry);
  console.log(`[SIMULATED EMAIL] Sent to: ${to} | Subject: ${subject}. Check backend/database/emails.log for link.`);
}

async function sendEmail({ to, subject, text, html }) {
  // If credentials are not set, fallback to simulated logging
  if (!process.env.EMAIL_USER) {
    logEmailLocally(to, subject, text, html);
    return { simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"BinUthman Water" <${process.env.EMAIL_FROM || 'no-reply@binuthman.com'}>`,
      to,
      subject,
      text,
      html
    });
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending real email, falling back to local simulation:', error.message);
    logEmailLocally(to, subject, text, html);
    return { simulated: true, error: error.message };
  }
}

async function sendVerificationEmail(email, token, firstName) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationLink = `${frontendUrl}/verify-email?token=${token}`;
  const subject = 'Verify your BinUthman Water Account';
  const text = `Hello ${firstName},\n\nPlease verify your email address by clicking this link: ${verificationLink}`;
  const html = `
    <h3>Hello ${firstName},</h3>
    <p>Welcome to BinUthman Water! Please verify your email address to activate your account.</p>
    <a href="${verificationLink}" style="padding: 10px 18px; background-color: #0284c7; color: white; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
    <p>If the button doesn't work, copy and paste this link in your browser: <br/> ${verificationLink}</p>
  `;
  return await sendEmail({ to: email, subject, text, html });
}

async function sendPasswordResetEmail(email, token, firstName) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;
  const subject = 'Reset your BinUthman Water Password';
  const text = `Hello ${firstName},\n\nYou requested a password reset. Reset it by clicking here: ${resetLink}`;
  const html = `
    <h3>Hello ${firstName},</h3>
    <p>We received a request to reset your password. Click the link below to set a new password:</p>
    <a href="${resetLink}" style="padding: 10px 18px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
    <p>If the button doesn't work, copy and paste this link in your browser: <br/> ${resetLink}</p>
  `;
  return await sendEmail({ to: email, subject, text, html });
}

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
};
