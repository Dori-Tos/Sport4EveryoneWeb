import { query, action, A } from '@solidjs/router'
import { db } from './db'
import { z } from 'zod'

export const usersSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  administrator: z.boolean(),
  reservations: z.array(z.coerce.number()).optional().default([]),
  contacts: z.array(z.coerce.number()).optional().default([]),
  sportsCenters: z.array(z.coerce.number()).optional().default([]),
})

export const getUsers = query(async () => {
    'use server'
    const users = await db.user.findMany({
        include: {
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
  return await db.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: userData.password,
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
  return await db.user.delete({ where: { id } })
}

export const removeUserAction = action(removeUser, 'removeUser')

export const updateUser = async (id: number, data: any) => {
  'use server'
  const userData = usersSchema.parse(data)
  const updateData: any = {}

  if (userData.name !== undefined) updateData.name = userData.name
  if (userData.email !== undefined) updateData.email = userData.email
  if (userData.password !== undefined) updateData.password = userData.password
  if (userData.administrator !== undefined) updateData.administrator = userData.administrator
  if (userData.reservations !== undefined) updateData.reservations = userData.reservations
  if (userData.contacts !== undefined) updateData.contacts = userData.contacts
  if (userData.sportsCenters !== undefined) updateData.sportsCenters = userData.sportsCenters

  return await db.user.update({
    where: { id },
    data: updateData,
  })
}

export const updateUserAction = action(updateUser, 'updateUser')

// export const updateUser = async (id: number, data: any) => {
//   'use server'
//   try {
//     // Only update basic user properties, not relationships
//     return await db.user.update({
//       where: { id },
//       data: {
//         name: data.name,
//         email: data.email,
//         password: data.password,
//         administrator: data.administrator,
//       },
//     })
//   } catch (error) {
//     console.error("Update user error:", error)
//     throw error
//   }
// }