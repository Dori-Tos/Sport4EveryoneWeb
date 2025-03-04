import type { APIEvent } from '@solidjs/start/server'
import { removeSportCenter } from '~/lib/sportsCenters'

export async function DELETE(event: APIEvent) {
  const id = Number(event.params.id)
  if (isNaN(id)) {
    return new Response(
      JSON.stringify({ message: "Invalid ID" }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }
  try {
    await removeSportCenter(id)
    return new Response(
      JSON.stringify({ message: "Sports center deleted" }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to delete sports center",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}