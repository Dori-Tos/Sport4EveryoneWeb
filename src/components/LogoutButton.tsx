import { action, redirect } from "@solidjs/router"
import { getSession } from "~/lib/auth/session"
import { getLoginUrl } from "~/lib/auth/loginURL"

const logout = action(async () => {
    'use server'
    const session = await getSession()
    await session.clear()
    throw redirect(await getLoginUrl())
})

function LogoutButton() {
  return (
    <form method="post" action={logout}>
      <button type="submit">Log out</button>
    </form>
  )
}