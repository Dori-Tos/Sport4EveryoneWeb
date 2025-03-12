import { type RouteDefinition } from "@solidjs/router"
import ProfilePage from "~/components/ProfilePage"
import { MainCentered } from "~/components/Main"
import { MainHeader } from "~/components/Header"
import { useAuth } from "~/lib/auth"
import { createEffect, Show } from "solid-js"
import { useNavigate } from "@solidjs/router"

export default function Profile() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  
  // Redirect if not authenticated
  createEffect(() => {
    if (!isLoading() && !isAuthenticated()) {
      navigate('/login', { replace: true })
    }
  })
  
  return (
    <Show when={!isLoading()} fallback={<div>Loading...</div>}>
      <Show when={isAuthenticated()} fallback={<div>Redirecting to login...</div>}>
        <MainCentered>
          <MainHeader string="User Profile" />
          <ProfilePage />
        </MainCentered>
      </Show>
    </Show>
  )
}