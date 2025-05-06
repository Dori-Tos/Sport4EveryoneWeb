import { action, redirect } from "@solidjs/router"
import { getSession } from "./session"

export const logoutAction = action(async () => {
  'use server'
  const session = await getSession()
  await session.clear()
  throw redirect('/')
})