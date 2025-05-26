import type { APIEvent } from '@solidjs/start/server'
import { addSportFieldToSportsCenter } from '~/lib/sportsCenters'

export async function POST(event: APIEvent) {
  try {
    const body = await event.request.json()
    const formData = new FormData()
    formData.append('sportFieldName', body.sportFieldName)
    formData.append('sportFieldPrice', String(body.sportFieldPrice))
    formData.append('sportsCenterId', String(body.sportsCenterId))
    const sportFieldSports = typeof body.sportFieldSports === 'string' 
      ? JSON.parse(body.sportFieldSports.replace(/'/g, '"')) // Handle potential single quotes
      : body.sportFieldSports;
    
    // Now use the parsed array
    if (Array.isArray(sportFieldSports)) {
      sportFieldSports.forEach((sport: string | number) => {
        formData.append('sportFieldSports', String(sport))
      })
    } else {
      // Fallback if it's a single value
      formData.append('sportFieldSports', String(sportFieldSports))
    }
    
    const newSportField = await addSportFieldToSportsCenter(formData)
    
    return new Response(JSON.stringify(newSportField), {
      headers: { 'Content-Type': 'application/json' }, status: 201
    })
  } catch (error: any) {
    console.error("Error adding sport field:", error)
    return new Response(
      JSON.stringify({
        message: "Failed to add sport field",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}