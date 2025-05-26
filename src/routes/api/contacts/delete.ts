import type { APIEvent } from '@solidjs/start/server'
import { db } from '~/lib/db'
import { getSession, getSessionData } from '~/lib/auth/session'

export async function DELETE(event: APIEvent) {
  try {
    // const session = await getSession()
    // if (!session.data.userId) {
    //   return new Response(
    //     JSON.stringify({ message: "Unauthorized" }), 
    //     { headers: { 'Content-Type': 'application/json' }, status: 401 }
    //   )
    // }

    const body = await event.request.json()
    if (!body) {
      return new Response(
        JSON.stringify({ message: "No data provided" }), 
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    const userId = body.userId
    const contactId = body.contactId

    // Validate data
    if (!userId || !contactId || isNaN(userId) || isNaN(contactId)) {
      return new Response(
        JSON.stringify({ message: "Invalid user or contact ID" }), 
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // // Only allow deleting contacts for the current user unless admin
    // if (userId !== session.data.userId) {
    //   // Optional: Check if admin
    //   return new Response(
    //     JSON.stringify({ message: "Unauthorized to delete contacts for other users" }), 
    //     { headers: { 'Content-Type': 'application/json' }, status: 403 }
    //   )
    // }

    // Delete contact
    const deletedContact = await db.contact.deleteMany({
      where: {
        userId: userId,
        contactId: contactId,
      },
    })

    return new Response(
      JSON.stringify(deletedContact), 
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    console.error("Delete contact error:", error)
    return new Response(
      JSON.stringify({
        message: "Failed to delete contact",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}