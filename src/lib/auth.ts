import { createSignal } from "solid-js"
import type { User } from "./users"

// Store auth state but never store passwords
const [isAuthenticated, setIsAuthenticated] = createSignal(false)
const [currentUser, setCurrentUser] = createSignal<User | null>(null)
const [isLoading, setIsLoading] = createSignal(true)

// Server action to check authentication status
export async function checkAuthStatus() {
  'use server'
  try {
    const { getSession } = await import('./auth/session')
    const { getUser } = await import('./users')
    
    const session = await getSession()
    
    // Check for userId instead of email for better security
    if (session.data.userId) {
      const user = await getUser()
      if (user) {
        // Remove sensitive data before returning
        const { password, ...safeUser } = user
        return { authenticated: true, user: safeUser }
      } else {
        await session.clear()
        return { authenticated: false }
      }
    } else {
      return { authenticated: false }
    }
  } catch (error) {
    console.error("Auth status check error:", error)
    return { authenticated: false, error: "Failed to check authentication status" }
  }
}

// Server action for logout
export async function performLogout() {
  'use server'
  const { getSession } = await import('./auth/session')
  const session = await getSession()
  await session.clear()
  return { success: true }
}

// Create a client-side initialization function
export async function initializeAuth() {
  try {
    // Call the server action
    const result = await checkAuthStatus()
    
    if (result.authenticated && result.user) {
      setCurrentUser(result.user)
      setIsAuthenticated(true)
    } else {
      setCurrentUser(null)
      setIsAuthenticated(false)
    }
    
    return result
  } catch (error) {
    console.error("Auth initialization error:", error)
    setCurrentUser(null)
    setIsAuthenticated(false)
    return { authenticated: false, error: "Authentication failed" }
  } finally {
    setIsLoading(false)
  }
}

export function useAuth() {
  // Update login to use user object directly instead of email/password
  const login = async (user: Omit<User, 'password'>) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
    return { success: true }
  }
  
  const logout = async () => {
    try {
      setIsLoading(true)
      // Call the server action for logout
      const logoutResult = await performLogout()
      
      // Clear user data from memory
      setCurrentUser(null)
      setIsAuthenticated(false)
      return { success: true }
    } catch (error) {
      console.error("Logout error:", error)
      return { success: false, message: "Logout failed" }
    } finally {
      setIsLoading(false)
    }
  }
  
  const refreshUser = async () => {
    try {
      setIsLoading(true)
      const authStatus = await checkAuthStatus()
      
      if (authStatus.authenticated && authStatus.user) {
        setCurrentUser(authStatus.user)
        setIsAuthenticated(true)
        return authStatus.user
      }
      
      setIsAuthenticated(false)
      setCurrentUser(null)
      return null
    } catch (error) {
      console.error("User refresh error:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { 
    isAuthenticated, 
    currentUser,
    login,
    logout,
    refreshUser,
    isLoading,
    setLoading: setIsLoading
  }
}