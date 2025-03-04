import { query, action, A } from '@solidjs/router'
import { db } from './db'
import { z } from 'zod'

export const reservationSchema = z.object({
    userID: z.coerce.number(),
    sportsCenterID: z.coerce.number(),
    sportFieldID: z.coerce.number(),
    startDateTime: z.string().datetime(),
    duration: z.number(),
    price: z.number(),
})

export const getReservations = query(async () => {
    'use server'
    const reservations = await db.reservation.findMany({
        include: {
          user: true,
          sportsCenter: true,
          sportField: true,
        },
      })
    
      return reservations
}, 'getReservations')

export const addReservation = async (form: FormData) => {
  'use server'
  const reservationData = reservationSchema.parse({
    userID: form.get('userID'),
    sportsCenterID: form.get('sportsCenterID'),
    sportFieldID: form.get('sportFieldID'),
    startDateTime: form.get('startDateTime'),
    duration: form.get('duration'),
    price: form.get('price'),
  })
  return await db.reservation.create({
    data: {
      user: {
        connect: {
          id: reservationData.userID,
        },
      },
      sportsCenter: {
        connect: {
          id: reservationData.sportsCenterID,
        },
      },
      sportField: {
        connect: {
          id: reservationData.sportFieldID,
        },
      },
      date: reservationData.startDateTime,
      duration: reservationData.duration,
      price: reservationData.price,
    },
  })
}

export const addReservationAction = action(addReservation, 'addReservation')

export const removeReservation = async (id: number) => {
    'use server'
    return await db.reservation.delete({ where: { id, }, })
}

export const removeReservationAction = action(removeReservation, 'removeReservation')