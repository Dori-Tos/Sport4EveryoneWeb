// session.ts
'use server'

import { useSession } from 'vinxi/http'

type SessionData = {
    userId?: number; // Store user ID instead of email for security
}

export function getSession() {
    // Make sure to use a strong, randomly generated secret with at least 32 characters
    const sessionSecret = process.env.SESSION_SECRET || 'this_is_a_fallback_secret_that_is_at_least_32_chars_long_for_development_only';
    
    if (!process.env.SESSION_SECRET && process.env.NODE_ENV === 'production') {
        console.warn('WARNING: Using fallback session secret in production. Set SESSION_SECRET environment variable!');
    }
    
    return useSession<SessionData>({
        password: sessionSecret,
        cookieName: 'app-session',
        // Add security-related cookie options
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
            httpOnly: true,                                // Prevent JavaScript access
            sameSite: 'lax',                               // Protect against CSRF
            maxAge: 60 * 60 * 24 * 7,                      // One week expiry
            path: '/'
        }
    })
}