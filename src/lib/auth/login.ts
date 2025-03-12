import bcrypt from 'bcryptjs'
import { db } from '../db'
import { usersSchema } from '../users'
import { getSession } from './session'

export async function login(form: FormData) {
  'use server'
  const { email, password } = usersSchema.parse({
    email: form.get('email'),
    password: form.get('password'),
  })
  const record = await db.user.findUniqueOrThrow({ where: { email }})
  const loggedIn = await bcrypt.compare(password, record.password)
  if (loggedIn) {
    const session = await getSession()
    session.update({ email })
  }
}