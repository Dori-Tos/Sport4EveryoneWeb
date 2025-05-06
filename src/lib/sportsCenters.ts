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

export const newSportFieldSchema = z.object({
    sportFieldName: z.string(),
    sportFieldSports: z.array(z.coerce.number()),
    sportFieldPrice: z.coerce.number(),
    sportsCenterId: z.coerce.number(),
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

export const getSportsCentersByUser = query(async (userId: number) => {
    'use server'
    return await db.sportsCenter.findMany({
        where: { ownerId: userId },
        include: {
            sportFields: {
                select: { id: true },
            },
        }
    })
}, 'sportsCenterByUser')

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

export const addSportFieldToSportsCenter = async (form: FormData) => {
    'use server'

    try {
        // Get all sportFieldSports values as an array
        const sportFieldSports = form.getAll('sportFieldSports').map(Number);
        
        // Create a custom object with all form entries plus the array
        const formData = {
            ...Object.fromEntries(form.entries()),
            sportFieldSports: sportFieldSports
        }
        
        const queryData = newSportFieldSchema.parse(formData)

        const sportFieldId = await db.sportsField.create({
            data: {
                name: queryData.sportFieldName,
                sports: {
                    connect: queryData.sportFieldSports.map((id) => ({ id }))
                },
                price: queryData.sportFieldPrice,
            },
            select: {
                id: true,
            }
        })

        return await db.sportsCenter.update({
            where: { id: Number(queryData.sportsCenterId) },
            data: {
                sportFields: {
                    connect: { id: Number(sportFieldId.id) }
                }
            }
        })
    }
    catch (error) {
        console.error("Error adding sport field to sports center:", error)
        throw error
    }
}

export const addSportFieldToSportsCenterAction = action(addSportFieldToSportsCenter, 'addSportFieldToSportsCenter')