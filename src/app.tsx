import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { Suspense } from "solid-js"
import Nav from "~/components/Nav"
import { useAuth } from "~/lib/auth"
import LoginPopup from "~/components/LoginPopup"
import { UserProvider } from "~/components/Main"
import "./app.css"

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <UserProvider>
      <Router
        root={props => (
          <>
            {isAuthenticated() && <Nav />}
            <Suspense>
              {props.children}
            </Suspense>
            {!isAuthenticated() && <LoginPopup />}
          </>
        )}
      >
        <FileRoutes />
      </Router>
    </UserProvider>
  )
}