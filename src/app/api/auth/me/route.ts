// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(/* request: NextRequest */) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}