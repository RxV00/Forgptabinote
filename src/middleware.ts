// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/api/auth/login',
  '/api/auth/signup'
];

// Paths that require user role or higher
const userPaths = [
  '/user/dashboard',
  '/user/notes',
  '/user/account',
  '/api/notes/view'
];

// Paths that require provider role or higher
const providerPaths = [
  '/provider/dashboard',
  '/provider/notes',
  '/provider/earnings',
  '/api/notes/create',
  '/api/notes/edit'
];

// Paths that require admin role
const adminPaths = [
  '/admin/dashboard',
  '/admin/users',
  '/admin/providers',
  '/admin/notes',
  '/api/admin'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  if (publicPaths.some(path => pathname === path || pathname.startsWith('/api/auth/'))) {
    return NextResponse.next();
  }
  
  // Check for session cookie
  const sessionId = request.cookies.get('sessionId')?.value;
  
  if (!sessionId) {
    // Redirect to login if no session
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // For Edge runtime compatibility, we do basic validation here
  // and let the API routes handle more detailed validation
  
  // Check if accessing admin paths
  if (adminPaths.some(path => pathname.startsWith(path))) {
    // We'll check admin role in the API routes
    // Here we just make sure they have a session cookie
    return NextResponse.next();
  }
  
  // Check if accessing provider paths
  if (providerPaths.some(path => pathname.startsWith(path))) {
    // We'll check provider role in the API routes
    // Here we just make sure they have a session cookie
    return NextResponse.next();
  }
  
  // For user paths, just having the session cookie is enough for middleware
  if (userPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // For any other paths, allow if authenticated
  return NextResponse.next();
}

// Define which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public resources)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}