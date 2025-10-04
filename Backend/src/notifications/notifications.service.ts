import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendExpenseSubmittedNotification(
    to: string,
    expenseDetails: any,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Expense Submitted for Approval',
      html: `
        <h2>New Expense Submitted</h2>
        <p>An expense has been submitted for your approval.</p>
        <p><strong>Title:</strong> ${expenseDetails.title}</p>
        <p><strong>Amount:</strong> ${expenseDetails.amount} ${expenseDetails.currency}</p>
        <p><strong>Category:</strong> ${expenseDetails.category}</p>
        <p><strong>Submitted by:</strong> ${expenseDetails.submittedBy}</p>
        <p>Please log in to review and approve/reject this expense.</p>
      `,
    });
  }

  async sendExpenseApprovedNotification(
    to: string,
    expenseDetails: any,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Expense Approved',
      html: `
        <h2>Expense Approved</h2>
        <p>Your expense has been approved.</p>
        <p><strong>Title:</strong> ${expenseDetails.title}</p>
        <p><strong>Amount:</strong> ${expenseDetails.amount} ${expenseDetails.currency}</p>
        <p><strong>Approved by:</strong> ${expenseDetails.approvedBy}</p>
        <p>The expense will be processed for payment.</p>
      `,
    });
  }

  async sendExpenseRejectedNotification(
    to: string,
    expenseDetails: any,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Expense Rejected',
      html: `
        <h2>Expense Rejected</h2>
        <p>Your expense has been rejected.</p>
        <p><strong>Title:</strong> ${expenseDetails.title}</p>
        <p><strong>Amount:</strong> ${expenseDetails.amount} ${expenseDetails.currency}</p>
        <p><strong>Reason:</strong> ${expenseDetails.rejectionReason}</p>
        <p>Please contact your manager for more information.</p>
      `,
    });
  }

  async sendWelcomeEmail(to: string, userName: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Welcome to Expense Management System',
      html: `
        <h2>Welcome ${userName}!</h2>
        <p>Your account has been created successfully.</p>
        <p>You can now log in and start managing your expenses.</p>
      `,
    });
  }

  async sendPasswordResetEmail(
    to: string,
    userName: string,
    newPassword: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Password Reset - Expense Management System',
      html: `
        <h2>Password Reset</h2>
        <p>Hi ${userName},</p>
        <p>Your password has been reset successfully.</p>
        <p><strong>Your new password is:</strong> ${newPassword}</p>
        <p>Please log in with this password and change it immediately for security.</p>
        <p>If you did not request this password reset, please contact support immediately.</p>
      `,
    });
  }
}
