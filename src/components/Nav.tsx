import { useLocation } from "@solidjs/router"
import { JSXElement, Show } from "solid-js"
import { useAuth } from "~/lib/auth"

type NavLinkProps = {
  href: string
  children: JSXElement
}

function NavLink(props: NavLinkProps) {
  const location = useLocation()
  const active = (path: string) =>
    path == location.pathname ? "border-sky-600" : "border-transparent hover:border-sky-600"
  return (
    <li class={`border-b-2 ${active(props.href)} mx-1.5 sm:mx-6`}>
      <a href={props.href}>{props.children}</a>
    </li>
  )
}

export default function Nav() {
  const { logout, currentUser } = useAuth()
  
  const handleLogout = (e) => {
    e.preventDefault()
    logout()
  }

  return (
    <nav class="bg-sky-800">
      <ul class="flex items-center p-3 text-gray-200 w-full px-4">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/contacts">Contacts</NavLink>
        {/* Only show Sports Fields link if user is an administrator */}
        <Show when={currentUser()?.administrator}>
        <NavLink href="/sportFields">Sports Fields</NavLink>
        </Show>
        <li class="ml-auto flex items-center">
          <NavLink href="/profile">Profile</NavLink>
          <button 
            onClick={handleLogout}
            class="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}