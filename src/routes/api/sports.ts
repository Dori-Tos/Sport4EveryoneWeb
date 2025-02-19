import { useAction } from '@solidjs/router'
import type { APIEvent } from '@solidjs/start/server'
import { addSport, getSports } from '~/lib/sports'

export async function GET(event: APIEvent) {
  return await getSports()
}

export async function POST(event: APIEvent) {
  return await addSport(await event.request.formData())
}