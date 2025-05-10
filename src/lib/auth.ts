import { compare, hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from './prisma';
import { cookies } from 'next/headers';
import { Prisma, UserRole, UserStatus } from '@prisma/client'

export async function hashPassword(password: string): Promise<string> {
    return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
}

export async function createUser(
    email: string,
    password: string,
    name: string
): Promise<{ id: string; email: string; name: string; role: UserRole } | null> {
    try {
        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: UserRole.USER,
                status: UserStatus.ACTIVE,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });

        return user;
    } catch (error) {
        console.error('Failed to create user:', error);
        return null;
    }
}

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
    });
}

export async function getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
}

export async function changeUserRole(
    userId: string,
    newRole: UserRole,
    adminId: string
): Promise<boolean> {
    try{
        const admin = await prisma.user.findUnique({
            where: { id: adminId },
        });

        if (!admin || admin.role !== UserRole.ADMIN) {
            return false;
        }

        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
        });

        await createAuditLog(
            adminId,
            'USER_ROLE_CHANGED',
            {
                targetUserId: userId,
                oldRole: (await getUserById(userId))?.role,
                newRole
            }
        );

        return true;
    } catch (error) {
        console.error('Failed to change user role:', error);
        return false;
    }
}

export async function changeUserStatus(
    userId: string,
    newStatus: UserStatus,
    adminId: string,
    reason?: string
): Promise<boolean>  {
    try {
        const admin = await prisma.user.findUnique({
            where: { id: adminId },
        });

        if (!admin || admin.role !== UserRole.ADMIN) {
            return false;
        }

        await prisma.user.update({
            where: { id: userId },
            data: { status: newStatus },
        });

        await createAuditLog(
            adminId,
            'USER_STATUS_CHANGED',
            {
                targetUserId: userId,
                oldStatus: (await getUserById(userId))?.status,
                newStatus: newStatus,
                reason: reason
            }
        );

        return true;
    } catch (error) {
        console.error('Failed to change user status:', error);
        return false;
    }
}

export async function createAuditLog(
    userId: string,
    action: string,
    details?: Prisma.InputJsonValue
): Promise<void> {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                details: details || {},
            },
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
    }
}

export async function createSession(userId: string) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // Set expiration to 30 days from now

    const session = await prisma.session.create({
        data: {
            id: uuidv4(),
            userId,
            expires,
        },
    });

    (await cookies()).set('sessionId', session.id, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });

    return session;
}

export async function getSessionBySessionId(sessionId: string) {
    const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { user: true },
    });

    if (!session) return null;

    if (new Date() > session.expires) {
        await prisma.session.delete({
            where: { id: sessionId }
        });
        return null;
    }

    return session;
}

export async function getCurrentUser() {
    const sessionId = (await cookies()).get('sessionId')?.value;

    if (!sessionId) return null;

    const session = await getSessionBySessionId(sessionId);

    if (!session) {
        return null;
    }

    if (session.user.status === UserStatus.BANNED || session.user.status === UserStatus.SUSPENDED) {
        await logout();
        return null;
    }

    return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        status: session.user.status,
    };
}

export async function logout() {
    const sessionId = (await cookies()).get('sessionId')?.value;

    if (sessionId) {
        await prisma.session.delete({
            where: { id: sessionId },
        });
    }

    (await cookies()).delete('sessionId');
}