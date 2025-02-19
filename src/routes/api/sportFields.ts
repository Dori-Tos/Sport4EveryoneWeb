import type { APIEvent } from '@solidjs/start/server'
import { addSportField, getSportFields } from '~/lib/sportFields'

export async function GET(event: APIEvent) {
  return await getSportFields()
}

export async function POST(event: APIEvent) {
  return await addSportField(await event.request.formData())
}