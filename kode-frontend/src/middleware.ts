import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/cuenta'];
const adminRoutes = ['/admin'];
const authRoutes = ['/login', '/registro'];

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;

    const isProtected = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );
    const isAdmin = adminRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );

    // Redirect logged in users away from auth pages
    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL('/', nextUrl));
    }

    // Protect account routes
    if (isProtected && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    }

    // Protect admin routes
    if (isAdmin) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', nextUrl));
        }
        if (userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|$).*)',
    ],
};
