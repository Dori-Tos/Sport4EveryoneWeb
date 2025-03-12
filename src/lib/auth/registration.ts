import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Passwords are modified using hashing and salting
// Salting is a technique used to make passwords more secure by adding random characters to the password before hashing it
// And then adding the salting back to the hashed password
// This makes it harder for attackers to crack the password using a dictionary attacks

export const userSchema = z.object({
  login: z.string(),
  password: z.string().min(8),
})

export async function register(form: FormData) {
  'use server'
  const user = userSchema.parse({
    login: form.get('login'),
    password: form.get('password'),
  })
  user.password = await bcrypt.hash(user.password, 10)
  // Add 'user' to the database
  // ...
}