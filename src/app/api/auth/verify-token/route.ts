import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Get token from query params
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      console.log('No token provided in request');
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }
    
    console.log(`Verifying token: ${token}`);
    
    // Find token in database using raw query
    const passwordResets = await prisma.$queryRaw`
      SELECT pr.*, u.email 
      FROM "PasswordReset" pr
      JOIN "User" u ON pr."userId" = u.id
      WHERE pr.token = ${token}
    `;
    
    console.log(`Query results: ${passwordResets.length} results found`);
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
    
    // Token is valid
    console.log('Token is valid, email:', passwordReset.email);
    return NextResponse.json(
      { valid: true, email: passwordReset.email },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 