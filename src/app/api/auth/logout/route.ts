import { NextResponse } from 'next/server';
import { logout } from '@/lib/auth';

export async function POST(/* request: NextRequest */) {
    try {
        await logout();

        return NextResponse.json(
            { message: 'Logged out successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in logout route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}