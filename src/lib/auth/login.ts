import bcrypt from 'bcryptjs'
import { db } from '../db'
import { loginSchema } from '../users'
import { getSession, generateMobileToken } from './session' 
import { action, redirect } from '@solidjs/router'

export async function login(form: FormData, isMobile = false) {
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
    }
  })
  
  if (!user) {
    throw new Error("User does not exist")
  }
  
  // Compare passwords
  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    throw new Error("Invalid email or password")
  }
  
  // Success - create session without storing password
  const session = await getSession()
  
  // Only store minimal user information in session
  await session.update({ 
    userId: user.id,
  })
  
  // For mobile clients, generate a token
  let mobileToken = null
  if (isMobile) {
    mobileToken = await generateMobileToken(user.id)
  }
  
  return { 
    success: true,
    userId: user.id,
    mobileToken
  }
}

export const loginAction = action(async (form: FormData) => {
  'use server'
  await login(form)
  throw redirect('/')
})