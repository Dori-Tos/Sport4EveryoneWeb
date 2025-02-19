import { query, action } from '@solidjs/router'
import { db } from './db'
import { z } from 'zod'
import { sportSchema } from './sports'

export const sportsFieldSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    sports: z.array(sportSchema),
})

export const getSportFields = query(async () => {
    'use server'                              // If the client made the request => we fetch from the server
    return await db.sportsField.findMany()    // If the server made the request => we get localy from the database
}, 'getTasks')

export const addSportField = async (form: FormData) => {    // Action synchronizes the data
    'use server'
    const sportsField = sportsFieldSchema.parse({
        name: form.get('name'),
        sports: JSON.parse(form.get('sports') as string),
    })
    return await db.sportsField.create({ data: sportsField })
}

export const addSportFieldAction = action(addSportField)

export const removeSportField = action(async (id: number) => {
    'use server'
    return await db.sportsField.delete({ where: { id } })
  })