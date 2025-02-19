import { query, action } from '@solidjs/router'
import { db } from './db'
import { z } from 'zod'
import { sportsFieldSchema } from './sportFields'

export const getSportsCenters = query(async () => {
    'use server'                              
    return await db.sportsCenter.findMany()   
}, 'getTasks')

export const sportsCenterSchema = z.object({
  name: z.string(),
  location: z.string(),
  sportFields: z.array(sportsFieldSchema),
  attendance: z.number(),
})

export const addSportsCenter = action(async (form: FormData) => {    // Action synchronizes the data
    'use server'
    const sportsCenter = sportsCenterSchema.parse({
        name: form.get('name'),
        location: form.get('location'),
        sports: JSON.parse(form.get('sportFields') as string),
        attendance: Number(form.get('attendance')),
    })
    return await db.sportsCenter.create({ data: sportsCenter })
})

export const removeSportCenter = action(async (id: number) => {
    'use server'
    return await db.sportsCenter.delete({ where: { id } })
  })