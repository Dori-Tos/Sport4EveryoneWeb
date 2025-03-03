import { query, action, A } from '@solidjs/router'
import { db } from './db'
import { z } from 'zod'

export const sportsFieldSchema = z.object({
    name: z.string(),
    sports: z.array(z.coerce.number()),
    price: z.coerce.number(),
})

export const getSportFields = query(async () => {
    'use server'                                // If the client made the request => we fetch from the server
    return await db.sportsField.findMany({      // If the server made the request => we get localy from the database
        include: {
          sports: {
            select: { id: true },
          },
        },
      })
}, 'getSportFields')

export const getSportFieldsBySportsCenter = query(async (sportsCenterId?: number) => {
    'use server'
    if (sportsCenterId === undefined) return [];
    return await db.sportsField.findMany({
        where: { sportsCenterId: sportsCenterId }
    })
}, 'sportFieldsBySportsCenter' )

export const addSportField = async (form: FormData) => {  
    'use server'

    const sportsFieldData = sportsFieldSchema.parse({
        name: form.get('name'),
        sports: form.getAll('sports'),
        price: form.get('price'),
    })

    return await db.sportsField.create({
        data: {
            name: sportsFieldData.name,
            sports: {
                connect: sportsFieldData.sports.map((id) => ({ id }))
            },
            price: sportsFieldData.price,
        },
    })
}

export const addSportFieldAction = action(addSportField, 'addSportField')

export const removeSportField = async (id: number) => {
    'use server'
    return await db.sportsField.delete({ where: { id } })
}

export const removeSportFieldAction = action(removeSportField, 'removeSportField')

