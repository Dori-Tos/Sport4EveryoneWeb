import { query, action } from '@solidjs/router'
import { db } from './db'
import { z } from 'zod'
import { getSession, validateMobileToken } from './auth/session'
import bcrypt from 'bcryptjs'

export const usersSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(), // Make password optional for updates
  confirmPassword: z.string().optional(), // For confirmation during updates
  administrator: z.coerce.boolean(),
  reservations: z.array(z.any()).optional(),
  contacts: z.array(z.any()).optional(),
  contactOf: z.array(z.any()).optional(),
  sportsCenters: z.array(z.any()).optional(),
})

export type User = z.infer<typeof usersSchema>

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  administrator: z.coerce.boolean().default(false),
})

export const getUsers = query(async () => {
  'use server'
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      administrator: true,
      // Don't include password in the response
      reservations: true,
      contacts: {
        include: {
          contact: true,
        },
      },
      contactOf: {
        include: {
          user: true,
        },
      },
      sportsCenters: true,
    },
  })

  return users
}, 'getUsers')

export const getUser = query(async () => {
  'use server'
  try {
    const session = await getSession()
    if (!session.data.userId) {
      return null
    }

    return await db.user.findUniqueOrThrow({
      where: { id: session.data.userId },
      select: {
        id: true,
        name: true,
        email: true,
        administrator: true,
        // Don't include password in the response
        reservations: true,
        contacts: {
          include: {
            contact: true,
          },
        },
        contactOf: {
          include: {
            user: true,
          },
        },
        sportsCenters: true,
      }
    })
  } catch {
    return null
  }
}, 'getUser')

export const addUser = async (formData: FormData) => {
  'use server'
  const userData = usersSchema.parse({...Object.fromEntries(formData.entries()) })

  if (userData.password !== userData.confirmPassword) {
    throw new Error("Passwords do not match")
  }

  // Hash the password before storing
  const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 10): ''

  return await db.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      administrator: userData.administrator,
      reservations: {},
      contacts: {},
      contactOf: {},
      sportsCenters: {},
    },
  })
}

export const addUserAction = action(addUser, 'addUser')

export const removeUser = async (id: number) => {
  'use server'
  // Validate session permissions here if needed
  return await db.user.delete({ where: { id } })
}

export const removeUserAction = action(removeUser, 'removeUser')

export const updateUser = async (id: number, formData: FormData, mobileToken?: string | null) => {
  'use server'

  let currentUser;

  try {
    // Authenticate using either mobile token or cookies
    if (mobileToken) {
      const userId = await validateMobileToken(mobileToken);
      
      if (!userId) {
        throw new Error("Invalid or expired mobile token");
      }
      
      // Get user details
      currentUser = await db.user.findUniqueOrThrow({
        where: { id: userId },
        select: { id: true, email: true, administrator: true }
      });
    } else {
      // Use standard cookie-based session
      const session = await getSession();
      
      if (!session.data.userId) {
        throw new Error("Not authenticated");
      }
      
      currentUser = await db.user.findUniqueOrThrow({
        where: { id: session.data.userId },
        select: { id: true, email: true, administrator: true }
      });
    }

    // Only allow users to update their own profile unless they're an admin
    if (currentUser.id !== id && !currentUser.administrator) {
      throw new Error("Unauthorized");
    }

    // Rest of your function stays the same...
    const userData = usersSchema.parse({ id, ...Object.fromEntries(formData.entries()) })
    const updateData: any = {}

    if (userData.name !== undefined) updateData.name = userData.name
    if (userData.email !== undefined) updateData.email = userData.email
    // We don't directly use the password from input
    if (userData.password !== undefined && userData.password == userData.confirmPassword) {
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      updateData.password = hashedPassword
    }
    if (userData.administrator !== undefined) {
      // Changing administrator status allowed only if the current user is an admin
      if (currentUser.administrator) {
        updateData.administrator = userData.administrator
      }
    }
    if (userData.reservations !== undefined) updateData.reservations = userData.reservations
    if (userData.contacts !== undefined) updateData.contacts = userData.contacts
    if (userData.sportsCenters !== undefined) updateData.sportsCenters = userData.sportsCenters

    return await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        administrator: true,
        // Don't include password in the response
        reservations: true,
        contacts: {
          include: {
            contact: true,
          },
        },
        contactOf: {
          include: {
            user: true,
          },
        },
        sportsCenters: true,
      }
    })
  } catch (error) {
    console.error('Error in updateUser:', error)
    throw error
  }
}

export const updateUserAction = action(updateUser, 'updateUser')