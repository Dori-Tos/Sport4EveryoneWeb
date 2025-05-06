import bcrypt from 'bcryptjs'
import { db } from '../db'
import { loginSchema } from '../users'
import { getSession } from './session'
import { action, redirect } from '@solidjs/router'

export async function login(form: FormData) {
  'use server'
    const email = form.get('email')?.toString()
    const password = form.get('password')?.toString()
    
    if (!email || !password) {
      throw new Error("Email and password are required")
    }
    
    // Validate input
    try {
      loginSchema.parse({ email, password })
    } catch (error) {
      throw new Error("Invalid email or password format")
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
      throw new Error("User does not exist")
    }
    
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      // Return generic message to prevent user enumeration
      throw new Error("Invalid email or password")
    }
    
    // Success - create session without storing password
    const session = await getSession()
    
    // Only store minimal user information in session
    await session.update({ 
      userId: user.id,
      // Don't store password here!
    })
}

export const loginAction = action(async (form: FormData) => {
  'use server'
  await login(form)
  throw redirect('/')
})