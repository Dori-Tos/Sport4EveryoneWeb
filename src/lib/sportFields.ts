import { query, action } from '@solidjs/router'
import { db } from './db'
import { z } from 'zod'
import { sportSchema } from './sports'

export const getSportFields = query(async () => {
    'use server'                              // If the client made the request => we fetch from the server
    return await db.sportsField.findMany()    // If the server made the request => we get localy from the database
}, 'getTasks')

export const sportsFieldSchema = z.object({
  name: z.string(),
  sports: z.array(sportSchema),
})

export const addSportField = action(async (form: FormData) => {    // Action synchronizes the data
    'use server'
    const sportsField = sportsFieldSchema.parse({
        name: form.get('name'),
        sports: JSON.parse(form.get('sports') as string),
    })
    return await db.sportsField.create({ data: sportsField })
})

export const removeSportField = action(async (id: number) => {
    'use server'
    return await db.sportsField.delete({ where: { id } })
  })