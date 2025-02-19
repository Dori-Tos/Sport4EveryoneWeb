import { query, action } from '@solidjs/router'
import { db } from './db'
import { z } from 'zod'

export const getSports = query(async () => {
    'use server'                        // If the client made the request => we fetch from the server
    return await db.sport.findMany()    // If the server made the request => we get localy from the database
}, 'getTasks')

export const sportSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
})

export const addSport = async (form: FormData) => {    // Action synchronizes the data
    'use server'
    const sport = sportSchema.parse({
        name: form.get('name'),
  })
  return await db.sport.create({ data: sport })
}

export const addSportAction = action(addSport)

export const removeSport = action(async (id: number) => {
    'use server'
    return await db.sport.delete({ where: { id } })
  })