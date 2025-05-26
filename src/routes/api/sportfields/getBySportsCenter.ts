import type { APIEvent } from '@solidjs/start/server'
import { getSportFieldsBySportsCenter } from '~/lib/sportFields'

export async function POST(event: APIEvent) {
  try {
    const body = await event.request.json()
    const sportsCenterId = Number(body.sportsCenterId)

    if (!sportsCenterId) {
      return new Response(
        JSON.stringify({ message: "Sports Center ID is required" }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const sportFields = await getSportFieldsBySportsCenter(sportsCenterId, true)
    return new Response(JSON.stringify(sportFields), {
      headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
          message: "Failed to fetch sport fields",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}