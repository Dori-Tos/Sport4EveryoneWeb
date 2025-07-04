import type { APIEvent } from '@solidjs/start/server'
import { db } from '~/lib/db'
import { getSession, getSessionData } from '~/lib/auth/session'

export async function POST(event: APIEvent) {
  try {
    // const session = await getSession()
    // if (!session.data.userId) {
    //   return new Response(
    //     JSON.stringify({ message: "Unauthorized" }), 
    //     { headers: { 'Content-Type': 'application/json' }, status: 401 }
    //   )
    // }
    
    const body = await event.request.json()
    const userId = Number(body.userId)
    const contactId = Number(body.contactId)
    
    console.log("Adding contact:", { userId, contactId })

    // Validate data
    if (!userId || !contactId || isNaN(userId) || isNaN(contactId)) {
      return new Response(
        JSON.stringify({ message: "Invalid user or contact ID" }), 
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // // Only allow adding contacts for the current user unless admin
    // if (userId !== session.data.userId) {
    //   // Optional: Check if admin
    //   return new Response(
    //     JSON.stringify({ message: "Unauthorized to add contacts for other users" }), 
    //     { headers: { 'Content-Type': 'application/json' }, status: 403 }
    //   )
    // }
    
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