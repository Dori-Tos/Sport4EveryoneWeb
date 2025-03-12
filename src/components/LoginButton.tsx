import { action, redirect } from "@solidjs/router"
import { getLoginUrl } from "~/lib/auth/loginURL"

const login = action(async () => {
    // getLoginUrl will be implemented later
    throw redirect(await getLoginUrl())
}, 'startLogin')
  
function LoginButton() {
  return (
    <form method="post" action={login}>
      <button type="submit">Log in</button>
    </form>
  )
}