import type { APIEvent } from '@solidjs/start/server'
import { removeSport } from '~/lib/sports'

export async function DELETE(event: APIEvent) {
  const body = await event.request.json()
  const id = Number(body.id)
  
  if (isNaN(id)) {
    return new Response(
      JSON.stringify({ message: "Invalid ID" }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }
  try {
    await removeSport(id)
    return new Response(
      JSON.stringify({ message: "Sport deleted" }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to delete sport",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}