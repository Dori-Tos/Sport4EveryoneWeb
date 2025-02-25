

export type SportsCenterItem = ({
    id: number,
    "Sports Center": string
    "Location": string
    "Opening Time": string
    "Attendance": string
})

export type SportFieldsItem = {
  id: number
  name: string
  price: string
}

export type ReservationItem = {
  date: string
  time: string
  sportFieldIds: number[]
  sportCenterId: number
  userId: number
}