import { login } from '~/lib/auth/login'
import type { APIEvent } from '@solidjs/start/server'
import { getSession } from '~/lib/auth/session'

export async function POST(event: APIEvent) {
  try {
    // Support both FormData and JSON request bodies
    let loginData;
    const contentType = event.request.headers.get('content-type') || '';
    
    const isMobile = contentType.includes('application/x-www-form-urlencoded');
    
    if (contentType.includes('application/json')) {
      // Handle JSON requests
      const jsonData = await event.request.json();
      const formData = new FormData();
      formData.append('email', jsonData.email);
      formData.append('password', jsonData.password);
      loginData = formData;
    } else {
      // Handle form data (both web and mobile form submissions)
      try {
        const formData = await event.request.formData();
        loginData = formData;
      } catch (e) {
        console.error("Failed to parse form data:", e);
        // If formData parsing fails, try to parse as URL encoded form
        const text = await event.request.text();
        console.log("Raw request body:", text);
        
        const params = new URLSearchParams(text);
        loginData = new FormData();
        for (const [key, value] of params.entries()) {
          loginData.append(key, value);
        }
      }
    }
    
    // Pass the isMobile flag to the login function
    const result = await login(loginData, isMobile);
    
    // For mobile clients, include the mobile token in the response
    if (isMobile) {
      return new Response(JSON.stringify({
        success: true,
        userId: result.userId,
        mobileToken: result.mobileToken 
      }), {
        headers: { 
          'Content-Type': 'application/json',
        },
      });
    } else {
      // For web clients, the session middleware handles cookies automatically
      return new Response(JSON.stringify({
        success: true,
      }), {
        headers: { 
          'Content-Type': 'application/json'
        },
      });
    }
  }
  catch (error: any) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Authentication failed',
      error: error.message 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}