import type { APIEvent } from '@solidjs/start/server'
import { updateUser } from '~/lib/users'

export async function POST(event: APIEvent) {
  try {
    const body = await event.request.json()
    const headers = event.request.headers
    
    // Check for mobile token in headers or body
    const mobileToken = headers.get('x-mobile-token') || body.mobileToken || null
    
        // Create a parsed object with correct types before creating FormData
    const parsedBody = {
      // Convert ID to number
      id: typeof body.id === 'string' ? parseInt(body.id) : body.id,
      name: body.name,
      email: body.email,
      administrator: typeof body.administrator === 'string' ? 
                    body.administrator === 'true' : Boolean(body.administrator),
    }
    
    // Now create FormData with the correctly parsed values
    const formData = new FormData()
    
    formData.append('name', parsedBody.name)
    formData.append('email', parsedBody.email)
    formData.append('administrator', parsedBody.administrator.toString())
    
    // Add optional fields if they exist
    if (body.password) formData.append('password', body.password)
    if (body.confirmPassword) formData.append('confirmPassword', body.confirmPassword)

    console.log('Parsed data:', {
      id: parsedBody.id,
      name: parsedBody.name,
      email: parsedBody.email,
      administrator: parsedBody.administrator,
    })
    
    // Validate required fields
    if (!parsedBody.id || !parsedBody.name || !parsedBody.email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const updatedUser = await updateUser(parsedBody.id, formData, mobileToken)
    
    return new Response(JSON.stringify(updatedUser), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal Server Error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}