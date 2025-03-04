import type { APIEvent } from '@solidjs/start/server'
import { addUser, getUsers, removeUser } from '~/lib/users'

export async function GET(event: APIEvent) {
    try {
        const users = await getUsers()
        return new Response(JSON.stringify(users), {
            headers: { 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error: any) {
        return new Response(
            JSON.stringify({
                message: "Failed to fetch users",
                error: error.message || String(error),
            }),
            { headers: { 'Content-Type': 'application/json' }, status: 500 }
        )
    }
}

export async function POST(event: APIEvent) {
    try {
        const formData = await event.request.formData()
        const newUser = await addUser(formData)
        return new Response(JSON.stringify(newUser), {
            headers: { 'Content-Type': 'application/json' }, status: 201 }
        )
    } catch (error: any) {
        return new Response(
            JSON.stringify({
                message: "Failed to add user",
                error: error.message || String(error),
            }),
            { headers: { 'Content-Type': 'application/json' }, status: 500 }
        )
    }
}

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