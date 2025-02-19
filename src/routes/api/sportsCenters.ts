import type { APIEvent } from '@solidjs/start/server'
import { addSportsCenter, getSportsCenters } from '~/lib/sportsCenters'

export async function GET(event: APIEvent) {
  return await getSportsCenters()
}

export async function POST(event: APIEvent) {
  return await addSportsCenter(await event.request.formData())
}