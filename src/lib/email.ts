import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  try {
    console.log(`[EMAIL] Sending email to: ${to}`);
    console.log(`[EMAIL] Subject: ${subject}`);

    // Check if email configuration is present
    if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
      throw new Error('Email configuration is missing');
    }

    // Create a test account if in development and no real credentials
    let transporter;
    if (process.env.NODE_ENV === 'development' && 
        process.env.EMAIL_SERVER_USER.includes('example.com')) {
      console.log('[EMAIL] Using ethereal test account');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      // Use configured email service
      console.log('[EMAIL] Using configured Gmail service');
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });
    }

    // Verify connection configuration
    await transporter.verify().catch(error => {
      console.error('[EMAIL] SMTP connection verification failed:', error);
      throw error;
    });

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_SERVER_USER, // Use the authenticated user
      to,
      subject,
      text,
      html,
    });

    console.log(`[EMAIL] Email sent successfully! Message ID: ${info.messageId}`);
    
    // If using ethereal email, show the preview URL
    if (info.messageId && info.messageId.includes('ethereal')) {
      console.log(`[EMAIL] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return info;
  } catch (error) {
    console.error('[EMAIL] Failed to send email:', error);
    throw error;
  }
} 