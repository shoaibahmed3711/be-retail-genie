import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
  constructor() {
    // Create transporter with your Hostinger SMTP settings
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,        // Using SMTP_HOST from your .env
      port: parseInt(process.env.SMTP_PORT),  // Using SMTP_PORT from your .env
      secure: process.env.SMTP_SECURE === 'true',  // Using SMTP_SECURE from your .env
      auth: {
        user: process.env.SMTP_USER,    // Using SMTP_USER from your .env
        pass: process.env.SMTP_PASS     // Using SMTP_PASS from your .env
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter connection
    this.transporter.verify((error, success) => {
      if (error) {
        console.log('SMTP Connection Error:', error);
      } else {
        console.log('SMTP Server is ready to take messages');
      }
    });
  }

  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      throw new Error("Failed to send email");
    }
  }

  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendVerificationCode(email) {
    const code = this.generateVerificationCode();
    const html = `
            <h1>Email Verification</h1>
            <p>Your verification code is: <strong>${code}</strong></p>
            <p>This code will expire in 24 hours.</p>
            <p>If you didn't request this code, please ignore this email.</p>
        `;

    await this.sendEmail(email, "Verify Your Email", html);
    return code; // Return the code so it can be stored and verified later
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Please click the link below to set a new password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `;

    await this.sendEmail(email, "Password Reset Request", html);
  }
}

export default new EmailService();
