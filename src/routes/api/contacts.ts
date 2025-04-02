import type { APIEvent } from '@solidjs/start/server'
import { db } from '~/lib/db'
import { getSession } from '~/lib/auth/session'

export async function GET(event: APIEvent) {
  try {
    const session = await getSession()
    if (!session.data.userId) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }), 
        { headers: { 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Get the search term from the query params
    const url = new URL(event.request.url)
    const searchTerm = url.searchParams.get('term')
    
    if (!searchTerm || searchTerm.length < 2) {
      return new Response(
        JSON.stringify([]), 
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Search for users that match the term PARTIALLY (not exact match)
    const users = await db.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm } },  // Partial name matching
          { email: { contains: searchTerm } }  // Partial email matching
        ],
        // Exclude the current user
        NOT: {
          id: session.data.userId
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        // Don't include sensitive information
      },
      take: 10 // Limit results for performance
    })

    return new Response(
      JSON.stringify(users), 
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    console.error("User search error:", error)
    return new Response(
      JSON.stringify({
        message: "Failed to search users",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

export async function POST(event: APIEvent) {
  try {
    const session = await getSession()
    if (!session.data.userId) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }), 
        { headers: { 'Content-Type': 'application/json' }, status: 401 }
      )
    }
    
    const formData = await event.request.formData()
    const userId = Number(formData.get('userId'))
    const contactId = Number(formData.get('contactId'))
    
    // Validate data
    if (!userId || !contactId || isNaN(userId) || isNaN(contactId)) {
      return new Response(
        JSON.stringify({ message: "Invalid user or contact ID" }), 
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Only allow adding contacts for the current user unless admin
    if (userId !== session.data.userId) {
      // Optional: Check if admin
      return new Response(
        JSON.stringify({ message: "Unauthorized to add contacts for other users" }), 
        { headers: { 'Content-Type': 'application/json' }, status: 403 }
      )
    }
    
    // Create contact
    const contact = await db.contact.create({
      data: {
        userId: userId,
        contactId: contactId,
      },
    })
    
    return new Response(
      JSON.stringify(contact), 
      { headers: { 'Content-Type': 'application/json' }, status: 201 }
    )
  } catch (error: any) {
    console.error("Add contact error:", error)
    return new Response(
      JSON.stringify({
        message: "Failed to add contact",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}