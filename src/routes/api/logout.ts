import type { APIEvent } from '@solidjs/start/server'
import { getSession } from '~/lib/auth/session'

export async function POST(event: APIEvent) {
  try {
    const session = await getSession()
    await session.clear()
    
    return new Response(JSON.stringify({
      success: true,
      message: "Successfully logged out"
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error: any) {
    console.error("Logout error:", error)
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to logout",
      error: error.message || String(error)
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
}