import { NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

// Define schema for validation
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Function to generate reset token
async function generateResetToken(userId: string) {
  // Generate a unique token
  const token = uuidv4();
  
  // Store token with expiration date (24 hours)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  try {
    console.log(`Creating password reset token for user ID: ${userId}`);
    console.log('Available Prisma models:', Object.keys(prisma).join(', '));
    
    // Use direct Prisma query to create token
    const passwordReset = await prisma.$queryRaw`
      INSERT INTO "PasswordReset" ("id", "token", "userId", "expiresAt", "createdAt")
      VALUES (${uuidv4()}, ${token}, ${userId}, ${expiresAt}, ${new Date()})
      RETURNING "id"
    `;
    
    console.log('Password reset token created:', passwordReset);
    return token;
  } catch (error) {
    console.error('Error generating reset token:', error);
    throw new Error('Failed to generate reset token');
  }
}

export async function POST(request: Request) {
  try {
    console.log('Forgot password request received');
    
    // Parse request body
    const body = await request.json();
    
    // Validate request data
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      console.error('Invalid request data:', result.error);
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    const { email } = result.data;
    console.log(`Processing password reset for email: ${email}`);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    // For security reasons, don't reveal if user exists or not
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return NextResponse.json(
        { message: 'If your email is registered, you will receive a password reset link' },
        { status: 200 }
      );
    }
    
    console.log(`User found, generating reset token for user ID: ${user.id}`);
    // Generate reset token
    const token = await generateResetToken(user.id);
    
    // Create reset URL with token (simple direct approach)
    const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;
    console.log(`Reset URL generated: ${resetUrl}`);
    
    console.log('Attempting to send reset email');
    try {
      // Send email with reset link
      await sendEmail({
        to: email,
        subject: 'Reset Your Password - AbiNote',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #4F46E5; margin-bottom: 10px;">AbiNote</h1>
              <h2 style="color: #333; margin-bottom: 20px;">Password Reset</h2>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Hello,</p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              We received a request to reset your password for your AbiNote account. 
              Click the button below to set a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                Create New Password
              </a>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 15px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            
            <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 14px; word-break: break-all; margin-bottom: 20px;">
              ${resetUrl}
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              This link will expire in 24 hours for security reasons.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              If you didn't request a password reset, please ignore this email or contact support if you're concerned.
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #999; font-size: 14px; text-align: center;">
              <p>&copy; ${new Date().getFullYear()} AbiNote. All rights reserved.</p>
            </div>
          </div>
        `,
      });
      console.log('Reset email sent successfully');
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      // Continue execution but log the error
    }
    
    return NextResponse.json(
      { message: 'If your email is registered, you will receive a password reset link' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error handling forgot password request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 