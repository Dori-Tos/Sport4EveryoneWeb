import type { APIEvent } from '@solidjs/start/server'
import { getReservationsByUser } from '~/lib/reservations'

export async function POST(event: APIEvent) {
  try {
    const body = await event.request.json()
    const userId = Number(body.userId)
    
    if (!userId) {
      return new Response(
        JSON.stringify({ message: "User ID is required" }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const reservations = await getReservationsByUser(userId)
    return new Response(JSON.stringify(reservations), {
      headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
          message: "Failed to fetch reservations",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}