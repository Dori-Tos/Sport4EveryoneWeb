import type { APIEvent } from '@solidjs/start/server'
import { getSportsCenter } from '~/lib/sportsCenters'

export async function POST(event: APIEvent) {
  const body = await event.request.json()
  const id = Number(body.id)

  if (isNaN(id)) {
    return new Response(
      JSON.stringify({ message: "Invalid ID" }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }
  try {
    const sportCenter = await getSportsCenter(id)
    return new Response(JSON.stringify(sportCenter), {
      headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to fetch sports center",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}