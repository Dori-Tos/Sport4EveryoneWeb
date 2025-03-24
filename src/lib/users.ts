import { query, action } from '@solidjs/router'
import { db } from './db'
import { z } from 'zod'
import { getSession } from './auth/session'
import bcrypt from 'bcryptjs'

export const usersSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(), // Make password optional for updates
  administrator: z.boolean(),
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
    if (!session.data.email) {
      return null
    }

    return await db.user.findUniqueOrThrow({
      where: { email: session.data.email },
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

export const addUser = async (form: FormData) => {
  'use server'
  const userData = usersSchema.parse({
    name: form.get('name'),
    email: form.get('email'),
    password: form.get('password'),
    administrator: form.get('administrator') === 'true',
    reservations: [],
    contacts: [],
    sportsCenters: [],
  })

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(userData.password, 10)

  return await db.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      administrator: userData.administrator,
      reservations: {},
      contacts: {},
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

export const updateUser = async (id: number, data: any) => {
  'use server'
  // Validate the session to ensure the user can only update their own profile
  // unless they are an administrator
  const session = await getSession()
  if (!session.data.email) {
    throw new Error("Not authenticated")
  }

  const currentUser = await db.user.findUniqueOrThrow({
    where: { email: session.data.email },
    select: { id: true, administrator: true }
  })

  // Only allow users to update their own profile unless they're an admin
  if (currentUser.id !== id && !currentUser.administrator) {
    throw new Error("Unauthorized")
  }

  const userData = usersSchema.parse(data)
  const updateData: any = {}

  if (userData.name !== undefined) updateData.name = userData.name
  if (userData.email !== undefined) updateData.email = userData.email
  // Don't directly use the password from input - it should already be hashed if included
  if (userData.password !== undefined) updateData.password = userData.password
  if (userData.administrator !== undefined) {
    // Only allow changing administrator status if the current user is an admin
    if (currentUser.administrator) {
      updateData.administrator = userData.administrator
    }
  }

  // These complex relations should be handled carefully if needed
  // Typically these would be updated through separate endpoints
  // but included here for completeness
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
}

export const updateUserAction = action(updateUser, 'updateUser')