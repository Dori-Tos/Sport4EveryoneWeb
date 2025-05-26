import type { APIEvent } from '@solidjs/start/server'
import { getUser } from '~/lib/users'

export async function GET(event: APIEvent) {
  try {
    const user = await getUser()
    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
          message: "Failed to fetch user",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}