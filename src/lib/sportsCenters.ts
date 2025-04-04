import { query, action } from '@solidjs/router'
import { db } from './db'
import { z } from 'zod'

export const sportsCenterSchema = z.object({
    name: z.string(),
    location: z.string(),
    attendance: z.coerce.number(),
    openingTime: z.string(),
    sportFields: z.array(z.coerce.number()),
})

export const getSportsCenters = query(async () => {
    'use server'                              
    return await db.sportsCenter.findMany({
        include: {
            sportFields: {
                select: { id: true },
            },
        }
    })  
}, 'getSportsCenters')

export const getSportsCentersBySport = query(async (sportName: string) => {
    'use server'
    return await db.sportsCenter.findMany({
      where: {
        sportFields: {
          some: {
            sports: {
              some: {
                name: sportName
              }
            }
          }
        }
      }
    })
}, 'sportsCenterBySport')

export const addSportsCenter = async (form: FormData) => {    // Action synchronizes the data
    'use server'
    const sportsCenterData = sportsCenterSchema.parse({
        name: form.get('name'),
        location: form.get('location'),
        attendance: form.get('attendance'),
        openingTime: form.get('openingTime'),
        sportFields: form.getAll("sportFields"),
    })
    return await db.sportsCenter.create({ 
        data: {
            name: sportsCenterData.name,
            location: sportsCenterData.location,
            attendance: sportsCenterData.attendance,
            openingTime: sportsCenterData.openingTime,
            sportFields: {
                connect: sportsCenterData.sportFields.map((id) => ({ id }))
            },
        } 
    })
}

export const addSportsCenterAction = action(addSportsCenter, 'addSportsCenter')

export const removeSportCenter = async (id: number) => {
    'use server'
    return await db.sportsCenter.delete({ where: { id } })
}

export const removeSportCenterAction = action(removeSportCenter, 'removeSportCenter')