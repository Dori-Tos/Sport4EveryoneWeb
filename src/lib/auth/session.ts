'use server'

import { useSession } from 'vinxi/http'
import crypto from 'crypto'

// Enhanced session data type
type SessionData = {
    userId?: number;
}

// Store mobile tokens in memory (only for development)
// In production, you would store these in Redis, database, etc.
const mobileTokenStore: Record<string, { userId: number, expires: number }> = {};

// Secret key for signing tokens
const MOBILE_SECRET = process.env.MOBILE_SECRET || 
    'this_is_a_fallback_secret_that_is_at_least_32_chars_long_for_development_only';

// Generate a mobile token for a user
export async function generateMobileToken(userId: number): Promise<string> {
    const tokenId = crypto.randomBytes(16).toString('hex');
    const expires = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days
    
    // Store token in our token store
    mobileTokenStore[tokenId] = {
        userId,
        expires
    };

    console.log(`Generated mobile token for user ${userId}: ${tokenId}`);
    console.log('Current token store:', mobileTokenStore);
    
    return tokenId;
}

// Validate a mobile token
export async function validateMobileToken(tokenId: string): Promise<number | null> {
    if (!tokenId) {
        console.log('No token provided');
        return null;
    }
    
    console.log('Validating mobile token:', tokenId);
    console.log('Current token store:', mobileTokenStore);
    
    // Check if token exists in our store
    const token = mobileTokenStore[tokenId];
    if (!token) {
        console.log('Token not found in store');
        return null;
    }
    
    // Check if token is expired
    if (Date.now() > token.expires) {
        console.log('Token expired');
        // Clean up expired token
        delete mobileTokenStore[tokenId];
        return null;
    }
    
    console.log('Token valid for user:', token.userId);
    return token.userId;
}

// Invalidate a mobile token (for logout)
export async function invalidateMobileToken(tokenId: string): Promise<boolean> {
    if (!mobileTokenStore[tokenId]) {
        return false;
    }
    
    // Remove the token
    delete mobileTokenStore[tokenId];
    
    return true;
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