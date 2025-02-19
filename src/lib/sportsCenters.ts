import { query, action } from '@solidjs/router'
import { db } from './db'
import { z } from 'zod'
import { sportsFieldSchema } from './sportFields'

export const sportsCenterSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    location: z.string(),
    sportFields: z.array(sportsFieldSchema),
    attendance: z.number(),
})

export const getSportsCenters = query(async () => {
    'use server'                              
    return await db.sportsCenter.findMany()   
}, 'getTasks')

export const addSportsCenter = async (form: FormData) => {    // Action synchronizes the data
    'use server'
    const sportsCenter = sportsCenterSchema.parse({
        name: form.get('name'),
        location: form.get('location'),
        sports: JSON.parse(form.get('sportFields') as string),
        attendance: Number(form.get('attendance')),
    })
    return await db.sportsCenter.create({ data: sportsCenter })
}

export const addSportsCenterAction = action(addSportsCenter)

export const removeSportCenter = action(async (id: number) => {
    'use server'
    return await db.sportsCenter.delete({ where: { id } })
  })