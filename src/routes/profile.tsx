import { type RouteDefinition } from "@solidjs/router"
import ProfilePage from "~/components/ProfilePage"
import { MainCentered } from "~/components/Main"
import { MainHeader } from "~/components/Header"

export const route = {} satisfies RouteDefinition

export default function Profile() {
  return (
    <MainCentered>
      <MainHeader string="User Profile" />
      <ProfilePage />
    </MainCentered>
  )
}
