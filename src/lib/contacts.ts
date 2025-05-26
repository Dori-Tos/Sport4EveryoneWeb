import { query, action } from '@solidjs/router'
import { db } from './db'
import { z } from 'zod'
import { getSession } from './auth/session'

export const contactSchema = z.object({
  userId: z.number(),
  contactId: z.number(),
  contact: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
  }).optional(),
})

export type Contact = z.infer<typeof contactSchema>

export const getContactsByUser = query(async (userId: number) => {
  'use server'
  if (!userId) return []

  const contacts = await db.contact.findMany({
    where: {
        userId: userId,
      },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
  })

  return contacts
}, 'getContactsByUser')

export const addContact = async (formData: FormData) => {
  'use server'
  const userId = Number(formData.get('userId'))
  const contactId = Number(formData.get('contactId'))
  
  if (!userId || !contactId) {
    throw new Error("Invalid userId or contactId")
  }
  
  // Verify both users exist
  const user = await db.user.findUnique({ where: { id: userId } })
  const contactUser = await db.user.findUnique({ where: { id: contactId } })
  
  if (!user || !contactUser) {
    throw new Error("User or contact not found")
  }

  try {
    // Check if the relationship already exists
    const existingContact = await db.contact.findUnique({
      where: {
        userId_contactId: {
          userId: userId,
          contactId: contactId
        }
      }
    })

    if (existingContact) {
      return existingContact // Contact already exists
    }

    // Create the both way contact relationship
    await db.contact.create({
      data: {
        userId: userId,
        contactId: contactId,
      },
    })
    return await db.contact.create({
      data: {
        userId: contactId,
        contactId: userId,
      },
    })

  } catch (error) {
    console.error("Server error adding contact:", error)
    throw error
  }
}

export const addContactAction = action(addContact, 'addContact')
  
export const removeContact = async (formData: FormData) => {
  'use server'
  const userId = Number(formData.get('userId'))
  const contactId = Number(formData.get('contactId'))
  
  if (!userId || !contactId || isNaN(userId) || isNaN(contactId)) {
    throw new Error("Invalid userId or contactId")
  }
  
  // Delete the contact relationship for both users
  await db.contact.delete({
    where: {
      userId_contactId: {
        userId: userId,
        contactId: contactId
      }
    }
  })

  return await db.contact.delete({
    where: {
      userId_contactId: {
        userId: contactId,
        contactId: userId
      }
    }
  })
}

export const removeContactAction = action(removeContact, 'removeContact')

export const searchContacts = async (query: string, userId: number) => {
  'use server'

  try {
    if (!query) return []
    if (!userId) return []

    const contacts = await db.user.findMany({
      where: {
        id: {
          not: userId,
        },
        OR: [
          { name: { contains: query } },
          { email: { contains: query } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return contacts
  } catch (error) {
    console.error("Error searching contacts:", error)
  }
}
export const searchContactsAction = action(searchContacts, 'searchContacts')