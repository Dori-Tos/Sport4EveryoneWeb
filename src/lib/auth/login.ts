import bcrypt from 'bcryptjs'
import { db } from '../db'
import { loginSchema } from '../users'
import { getSession } from './session'

export async function login(form: FormData) {
  'use server'
  try {
    const email = form.get('email')?.toString()
    const password = form.get('password')?.toString()
    
    if (!email || !password) {
      return { success: false, message: "Email and password are required" }
    }
    
    // Validate input
    try {
      loginSchema.parse({ email, password })
    } catch (error) {
      return { success: false, message: "Invalid email or password format" }
    }
    
    // Find the user
    const user = await db.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        // Don't select other sensitive fields
      }
    })
    
    if (!user) {
      // Return generic message to prevent user enumeration
      return { success: false, message: "Invalid email or password" }
    }
    
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password)
    
    if (!passwordMatch) {
      return { success: false, message: "Invalid email or password" }
    }
    
    // Success - create session without storing password
    const session = await getSession()
    
    // Only store minimal user information in session
    await session.update({ 
      userId: user.id,
      // Don't store password here!
    })
    
    // Don't return password to client
    const { password: _, ...safeUserData } = user
    
    return { 
      success: true, 
      user: safeUserData
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "Authentication failed" }
  }
}