'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole, UserStatus } from '@prisma/client';

interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    status: UserStatus;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password:string) => Promise<void>;
    signup: (email: string, password:string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    isAdmin: boolean;
    isProvider: boolean;
    isUser: boolean;
    isActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Computed properties
    const isAdmin = user?.role === UserRole.ADMIN;
    const isProvider = user?.role === UserRole.PROVIDER || user?.role === UserRole.ADMIN;
    const isUser = !!user; // Any authenticated user
    const isActive = user?.status == UserStatus.ACTIVE || user?.status == UserStatus.WARNED;

    useEffect(() => {
        async function loadUser() {
            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }

            const data = await response.json();
            setUser(data.user);

            // Redirect based on role
            if (data.user.role === UserRole.ADMIN || data.user.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else if (data.user.role === UserRole.PROVIDER || data.user.role === 'PROVIDER') {
                router.push('/provider/dashboard');
            } else {
                router.push('/user/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (email: string, password: string, name: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Signup failed');
            }

            await login(email, password);
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            setUser(null);
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            signup,
            logout,
            isAdmin,
            isProvider,
            isUser,
            isActive
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}