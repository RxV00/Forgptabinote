import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/auth';
import { z } from 'zod';

const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    name: z.string().min(3, 'Name must be at least 3 characters long'),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = signupSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { email, password, name } = result.data;

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already in use' },
                { status: 409 }
            );
        }

        const user = await createUser(email, password, name);
        if (!user) {
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'User created successfully', user },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in signup route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}