import type { APIEvent } from '@solidjs/start/server'
import { getSportsCentersByUser } from '~/lib/sportsCenters'

export async function POST(event: APIEvent) {
  const body = await event.request.json()
  const id = Number(body.userId)
  if (isNaN(id)) {
    return new Response(
      JSON.stringify({ message: "Invalid ID" }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }
  try {
    const sports = await getSportsCentersByUser(id)
    return new Response(JSON.stringify(sports), {
      headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to fetch sports centers",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}