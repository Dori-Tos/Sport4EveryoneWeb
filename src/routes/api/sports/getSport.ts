import type { APIEvent } from '@solidjs/start/server'
import { getSport } from '~/lib/sports'

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
    const sport = await getSport(id)
    if (!sport) {
      return new Response(
        JSON.stringify({ message: "Sport not found" }),
        { headers: { 'Content-Type': 'application/json' }, status: 404 }
      )
    }
    
    return new Response(JSON.stringify(sport), {
      headers: { 'Content-Type': 'application/json' }, status: 200
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to fetch sport",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}