import type { APIEvent } from '@solidjs/start/server'
import { getSportsCentersBySport } from '~/lib/sportsCenters'

export async function POST(event: APIEvent) {
  try {
    const body = await event.request.json();
    const sportName = body.sportName

    if (!sportName) {
      return new Response(
        JSON.stringify({ message: "Sport ID is required" }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    const sportsCenters = await getSportsCentersBySport(sportName)
    
    return new Response(JSON.stringify(sportsCenters), {
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