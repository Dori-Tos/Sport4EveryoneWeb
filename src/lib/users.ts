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
      });
    
      return users
}, 'getUsers')