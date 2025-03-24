import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { Suspense, onMount } from "solid-js"
import Nav from "~/components/Nav"
import { useAuth, initializeAuth } from "~/lib/auth"
import LoginPopup from "~/components/LoginPopup"
import { UserProvider } from "~/components/Main"
import "./app.css"

export default function App() {
  const { isAuthenticated, isLoading } = useAuth()
  
  onMount(async () => {
    try {
      await initializeAuth()
    } catch (error) {
      console.error("Error initializing authentication:", error)
    }
  })
  
  return (
    <UserProvider>
      <Router
        root={props => (
          <>
            {isLoading() && (
              <div class="fixed inset-0 flex items-center justify-center bg-white z-50">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600 mb-4"></div>
                  <p class="text-gray-700">Loading...</p>
                </div>
              </div>
            )}
            {isAuthenticated() && <Nav />}
            <Suspense>
              {props.children}
            </Suspense>
            {!isLoading() && !isAuthenticated() && <LoginPopup />}
          </>
        )}
      >
        <FileRoutes />
      </Router>
    </UserProvider>
  )
}