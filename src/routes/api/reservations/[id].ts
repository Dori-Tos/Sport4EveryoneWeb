import type { APIEvent } from '@solidjs/start/server'
import { removeReservation } from '~/lib/reservations'

export async function DELETE(event: APIEvent) {
    const id = Number(event.params.id)
    if (isNaN(id)) {
        return new Response(
        JSON.stringify({ message: "Invalid ID" }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
        )
    }
    try {
        await removeReservation(id)
        return new Response(
        JSON.stringify({ message: "Reservation deleted" }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error: any) {
        return new Response(
        JSON.stringify({
            message: "Failed to delete reservation",
            error: error.message || String(error),
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
        )
    }
}