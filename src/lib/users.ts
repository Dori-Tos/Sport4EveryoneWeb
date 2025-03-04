import { query, action, A } from '@solidjs/router'
import { db } from './db'
import { z } from 'zod'

export const usersSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    administrator: z.boolean(),
    reservations: z.array(z.coerce.number()),
    contacts: z.array(z.coerce.number()),
    sportsCenters: z.array(z.coerce.number()),
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