import type { APIEvent } from '@solidjs/start/server'
import { searchContacts } from '~/lib/contacts'

export async function POST(event: APIEvent) {
  try {
    const body = await event.request.json()
    const query = body.query
    const userId = body.userId
    
    if (!query) {
      return new Response(
        JSON.stringify({ message: "Search query is empty" }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const contacts = await searchContacts(query.toString(), userId)
    if (!contacts || contacts.length === 0) {
      return new Response(
        JSON.stringify({ message: "No contacts found" }),
        { headers: { 'Content-Type': 'application/json' }, status: 404 }
      )
    }
    else {
      return new Response(JSON.stringify(contacts), {
        headers: { 'Content-Type': 'application/json' }, status: 200 }
      )
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({
          message: "Failed to fetch contacts",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}