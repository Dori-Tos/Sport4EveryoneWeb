import type { APIEvent } from '@solidjs/start/server'
import { c } from 'vinxi/dist/types/lib/logger'
import { addSportField, getSportFields, removeSportField } from '~/lib/sportFields'

export async function GET(event: APIEvent) {
  try {
    const sports = await getSportFields()
    return new Response(JSON.stringify(sports), {
      headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to fetch sport fields",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

export async function POST(event: APIEvent) {
  try {
    const body = await event.request.json()
    const formData = new FormData()
    formData.append('name', body.name)
    formData.append('price', body.price)
    body.sports.forEach((sport: string) => {
      formData.append('sports', sport)
    })
    const newSport = await addSportField(formData)
    return new Response(JSON.stringify(newSport), {
      headers: { 'Content-Type': 'application/json' }, status: 201 }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to add sport field",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

export async function DELETE(event: APIEvent) {
  const body = await event.request.json()
  const id = Number(body.id)
  if (isNaN(id)) {
    return new Response(
      JSON.stringify({ message: `Invalid ID: ${event.params.id}` }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }
  try {
    const formData = new FormData()
    formData.append('id', String(id))
    await removeSportField(formData)
    return new Response(
      JSON.stringify({ message: "Sport field deleted" }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to delete sport field",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}