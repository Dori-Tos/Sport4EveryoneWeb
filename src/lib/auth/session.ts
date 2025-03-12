'use server'

import { useSession } from 'vinxi/http'

type SessionData = {
    email?: string
}

export function getSession() {
    return useSession<SessionData>({
        password: import.meta.env.VITE_SESSION_SECRET,
    })
}