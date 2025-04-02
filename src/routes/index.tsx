import { A, createAsync, createAsyncStore, query, useSubmissions, type RouteDefinition } from "@solidjs/router"
import { createSignal, createResource } from "solid-js"
import { MainCentered } from "~/components/Main"
import { MainHeader, MediumHeader } from "~/components/Header"
import { TableCentered } from "~/components/MainTable"
import SportTable from "~/components/SportTable"
import SportSelector from "~/components/SportSelector"
import { useAuth } from "~/lib/auth"
import { getSports } from "~/lib/sports"
import { getSportFields } from "~/lib/sportFields"
import { getSportsCentersBySport } from "~/lib/sportsCenters"
import { getReservationsByUser } from "~/lib/reservations"
import ReservationsTable from "~/components/ReservationsTable"

export const route = {
  preload() {
    getSports()
  },
} satisfies RouteDefinition

export default function Home() {
  const { currentUser, refreshUser } = useAuth()
  const [selectedSport, setSelectedSport] = createSignal("football")

  const sports = createAsyncStore(() => getSports(), { initialValue: [] })

  const sportsTableData = createAsyncStore(async () => {
    const centers = await getSportsCentersBySport(selectedSport())
    return centers.map((center: any) => ({
      id: center.id,
      "Sports Center": center.name,
      "Location": center.location,
      "Opening Time": center.openingTime,
      "Attendance": center.attendance,
    }))
  }, { initialValue: [
    {
      id: "id-unavailable",
      "Sports Center": "Name Unavailable",
      "Location": "Location Unavailable",
      "Opening Time": "Opening Time Unavailable",
      "Attendance": "Attendance Unavailable",
    }
  ]})

  const userReservations = createAsyncStore(async () => {
    if (!currentUser()?.id) return []
    
    return await getReservationsByUser(currentUser()?.id)
  }, { initialValue: [] })
  
  return (
    <MainCentered>
      <MainHeader string="Sports Centers"/>
      <TableCentered>
        <SportSelector 
          data={sports()} 
          selectedSport={selectedSport()} 
          setSelectedSport={setSelectedSport} 
        />
        <SportTable 
          data={sportsTableData() || []} 
        />
      </TableCentered>
      <MediumHeader string="Reservations"/>
      <ReservationsTable userReservations={userReservations}
        />
    </MainCentered>
  )
}