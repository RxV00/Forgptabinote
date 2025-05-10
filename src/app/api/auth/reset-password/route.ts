import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// Define schema for validation
const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate request data
    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    const { token, password } = result.data;
    console.log(`Processing password reset for token: ${token}`);
    
    // Find token in database
    const passwordResets = await prisma.$queryRaw`
      SELECT * FROM "PasswordReset" WHERE token = ${token}
    `;
    
    console.log(`Found ${passwordResets.length} matching tokens`);
    const passwordReset = passwordResets[0];
    
    // Check if token exists and is valid
    if (!passwordReset) {
      console.log('Token not found in database');
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }
    
    // Check if token is expired
    if (new Date() > new Date(passwordReset.expiresAt)) {
      console.log('Token expired');
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 400 }
      );
    }
    
    // Get the user to check current password
    const user = await prisma.user.findUnique({
      where: { id: passwordReset.userId }
    });
    
    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 400 }
      );
    }
    
    // Check if new password is the same as the old one
    const isSamePassword = await bcryptjs.compare(password, user.password);
    if (isSamePassword) {
      console.log('New password is the same as the old one');
      return NextResponse.json(
        { error: 'New password cannot be the same as your current password' },
        { status: 400 }
      );
    }
    
    console.log(`Resetting password for user: ${passwordReset.userId}`);
    
    // Hash the new password with bcryptjs (12 rounds)
    const hashedPassword = await bcryptjs.hash(password, 12);
    
    // Update user password
    const updatedUser = await prisma.user.update({
      where: { id: passwordReset.userId },
      data: { password: hashedPassword },
    });
    
    console.log(`Updated password for user: ${updatedUser.email}`);
    
    // Delete the used token
    const deleteResult = await prisma.$executeRaw`
      DELETE FROM "PasswordReset" WHERE id = ${passwordReset.id}
    `;
    
    console.log(`Deleted token, affected rows: ${deleteResult}`);
    
    return NextResponse.json(
      { message: 'Password has been reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 