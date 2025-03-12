import { createSignal, createEffect } from "solid-js"
import { getSession } from "./auth/session"
import { db } from "./db"
import bcrypt from "bcryptjs"
import { type User } from "./users"
import { getUser } from "./users"

const [isAuthenticated, setIsAuthenticated] = createSignal(false)
const [currentUser, setCurrentUser] = createSignal<User | null>(null)
const [isLoading, setIsLoading] = createSignal(true)

// Initialize authentication state from session
async function initializeAuth() {
  try {
    setIsLoading(true)
    const session = await getSession()
    
    if (session.data.email) {
      const user = await db.user.findUnique({
        where: { email: session.data.email },
        select: {
          id: true,
          name: true,
          email: true,
          administrator: true,
          // Don't include password in the response
          reservations: true,
          contacts: {
            include: {
              contact: true,
            },
          },
          contactOf: {
            include: {
              user: true,
            },
          },
          sportsCenters: true,
        }
      })
      
      if (user) {
        setCurrentUser(user)
        setIsAuthenticated(true)
      } else {
        // Session exists but user doesn't - clear invalid session
        await session.clear()
        setCurrentUser(null)
        setIsAuthenticated(false)
      }
    } else {
      setCurrentUser(null)
      setIsAuthenticated(false)
    }
  } catch (error) {
    console.error("Auth initialization error:", error)
    setCurrentUser(null)
    setIsAuthenticated(false)
  } finally {
    setIsLoading(false)
  }
}

// Call this when your app starts
// Typically in your root component or layout
initializeAuth()

export function useAuth() {
  const login = async (email: string, password: string) => {
    try {
      const user = await db.user.findUnique({ 
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          password: true, // Need password for comparison
          administrator: true,
          reservations: true,
          contacts: {
            include: {
              contact: true,
            },
          },
          contactOf: {
            include: {
              user: true,
            },
          },
          sportsCenters: true,
        }
      })
      
      if (user && await bcrypt.compare(password, user.password)) {
        const session = await getSession()
        await session.update({ email: user.email })
        
        // Remove password from user object before storing in state
        const { password: _, ...userWithoutPassword } = user
        setCurrentUser(userWithoutPassword)
        setIsAuthenticated(true)
        return { success: true, user: userWithoutPassword }
      }
      return { success: false, message: "Invalid credentials" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Authentication failed" }
    }
  }
  
  const logout = async () => {
    try {
      const session = await getSession()
      await session.clear()
      setCurrentUser(null)
      setIsAuthenticated(false)
      return { success: true }
    } catch (error) {
      console.error("Logout error:", error)
      return { success: false, message: "Logout failed" }
    }
  }
  
  const refreshUser = async () => {
    try {
      const userData = await getUser()
      if (userData) {
        setCurrentUser(userData)
        return userData
      }
      return null
    } catch (error) {
      console.error("User refresh error:", error)
      return null
    }
  }

  return { 
    isAuthenticated, 
    currentUser,
    setCurrentUser,
    login,
    logout,
    refreshUser,
    isLoading
  }
}