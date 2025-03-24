import bcrypt from 'bcryptjs'
import { db } from '~/lib/db'
import { login } from '~/lib/auth/login'
import { getSession } from '~/lib/auth/session'
import { loginSchema } from '~/lib/users'
import type { APIEvent } from '@solidjs/start/server'

export async function POST(event: APIEvent) {
  try {
    const formData = await event.request.formData()
    const result = await login(formData)
    return new Response(JSON.stringify(result), {
      headers: { 
        'Content-Type': 'application/json',
        // Set secure cookie attributes
        'Set-Cookie': 'HttpOnly; Secure; SameSite=Strict'
       },
      })
  }
  catch (error: any) {
    console.error('Login error:', error)
    return new Response(JSON.stringify({ success: false, message: 'Authentication failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// export async function POST(event: APIEvent) {
//   try {
//     const formData = await event.request.formData()
//     const { email, password } = loginSchema.parse({
//       email: formData.get('email'),
//       password: formData.get('password'),
//     })
//     console.log('Login attempt:', { email, password }) // Add logging

//     const user = await db.user.findUnique({ where: { email } })
//     if (!user) {
//       console.log('User not found:', email) // Add logging
//       return new Response(JSON.stringify({ success: false, message: 'Invalid credentials' }), {
//         headers: { 'Content-Type': 'application/json' },
//         status: 401,
//       })
//     }

//     const loggedIn = await bcrypt.compare(password, user.password)
//     if (loggedIn) {
//       const session = await getSession()
//       await session.update({ email: user.email })
//       console.log('Session updated for user:', email) // Add logging
      
//       // Don't return password in the response
//       const { password: _, ...userWithoutPassword } = user
      
//       return new Response(JSON.stringify({ success: true, user: userWithoutPassword }), {
//         headers: { 'Content-Type': 'application/json' },
//         status: 200,
//       })
//     } else {
//       console.log('Invalid password for user:', email) // Add logging
//       return new Response(JSON.stringify({ success: false, message: 'Invalid credentials' }), {
//         headers: { 'Content-Type': 'application/json' },
//         status: 401,
//       })
//     }
//   } catch (error: any) {
//     console.error('Login error:', error)
//     return new Response(JSON.stringify({ success: false, message: 'Authentication failed' }), {
//       headers: { 'Content-Type': 'application/json' },
//       status: 500,
//     })
//   }
// }