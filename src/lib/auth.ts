import { createSignal } from "solid-js"
import { getUsers } from "./users"

const [isAuthenticated, setIsAuthenticated] = createSignal(false)
const [currentUser, setCurrentUser] = createSignal(null)

export function useAuth() {
  const login = async (email, password) => {
    try {
      const users = await getUsers()
      
      const user = users.find(u => u.email === email && u.password === password)
      
      if (user) {
        setCurrentUser(user)
        setIsAuthenticated(true)
        return { success: true, user }
      }
      
      return { success: false, message: "Invalid credentials" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Authentication failed" }
    }
  }
  
  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  return { 
    isAuthenticated, 
    setIsAuthenticated,
    currentUser,
    setCurrentUser,
    login,
    logout
  }
}