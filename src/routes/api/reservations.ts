import type { APIEvent } from '@solidjs/start/server'
import { addReservation, getReservations, removeReservation } from '~/lib/reservations'

export async function GET(event: APIEvent) {
    try {
        const reservations = await getReservations()
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

export async function POST(event: APIEvent) {
    try {
        const formData = await event.request.formData()
        const newReservation = await addReservation(formData)
        return new Response(JSON.stringify(newReservation), {
            headers: { 'Content-Type': 'application/json' }, status: 201 }
        )
    } catch (error: any) {
        return new Response(
            JSON.stringify({
                message: "Failed to add reservation",
                error: error.message || String(error),
            }),
            { headers: { 'Content-Type': 'application/json' }, status: 500 }
        )
    }
}

export async function DELETE(event: APIEvent) {
    const id = Number(event.params.id)
    if (isNaN(id)){
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