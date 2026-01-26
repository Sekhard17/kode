import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { Role } from '@kode/shared';

// Extend the built-in types
declare module 'next-auth' {
    interface User {
        id: string;
        email: string;
        name: string | null;
        image: string | null;
        role: Role;
        accessToken: string;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            name: string | null;
            image: string | null;
            role: Role;
        };
        accessToken: string;
    }
}

import 'next-auth/jwt';

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        email: string;
        name: string | null;
        image: string | null;
        role: Role;
        accessToken: string;
    }
}

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!response.ok) {
                        return null;
                    }

                    const data = await response.json() as {
                        accessToken: string;
                        user: {
                            id: string;
                            email: string;
                            name: string | null;
                            image: string | null;
                            role: Role;
                        };
                    };

                    return {
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.name,
                        image: data.user.image,
                        role: data.user.role,
                        accessToken: data.accessToken,
                    };
                } catch {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
                token.role = user.role;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.id as string,
                email: token.email as string,
                name: (token.name as string | null) ?? null,
                image: (token.image as string | null) ?? null,
                role: token.role as Role,
            } as any; // Cast to any to satisfy the complex Session['user'] type in beta
            session.accessToken = token.accessToken as string;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    secret: process.env.AUTH_SECRET,
});
