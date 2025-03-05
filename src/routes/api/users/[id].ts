import type { APIEvent } from '@solidjs/start/server'
import { removeUser, updateUser } from '~/lib/users'

export async function DELETE(event: APIEvent) {
    const id = Number(event.params.id)
    if (isNaN(id)) {
        return new Response(
        JSON.stringify({ message: "Invalid ID" }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
        )
    }
    try {
        await removeUser(id)
        return new Response(
        JSON.stringify({ message: "User deleted" }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error: any) {
        return new Response(
        JSON.stringify({
            message: "Failed to delete user",
            error: error.message || String(error),
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
        )
    }
}

export async function PATCH(event: APIEvent) {
    const id = Number(event.params.id)
    if (isNaN(id)) {
        return new Response(
        JSON.stringify({ message: "Invalid ID" }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
        )
    }
    const body = await event.request.json()
    if (!body || typeof body !== 'object') {
        return new Response(
        JSON.stringify({ message: "Invalid body" }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
        )
    }
    try {
        await updateUser(id, body)
        return new Response(
        JSON.stringify({ message: "User updated" }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error: any) {
        return new Response(
        JSON.stringify({
            message: "Failed to update user",
            error: error.message || String(error),
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
        )
    }
}