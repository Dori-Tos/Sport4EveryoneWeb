import { createSignal, Show } from "solid-js"
import { useAuth } from "~/lib/auth"
import { useNavigate } from "@solidjs/router"

export default function LoginPopup() {
  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [error, setError] = createSignal("")
  const [loading, setLoading] = createSignal(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setError("")
    
    if (!email() || !password()) {
      setError("Please enter both email and password")
      return
    }
    
    try {
      setLoading(true)
    
      // Use FormData for better security when submitting to server
      const formData = new FormData()
      formData.append('email', email())
      formData.append('password', password())
      
      const result = await fetch('/api/login', {
        method: 'POST',
        body: formData,
        // Add proper headers for security
        headers: {
          // CSRF protection token if available
          // 'X-CSRF-Token': getCsrfToken(),
        }
      })
      
      const data = await result.json()
      
      if (data.success) {
        // Clear sensitive data from memory
        setPassword("")
        setEmail("")
        
        // Update authentication state
        await login(data.user)
        
        // Redirect to home page
        navigate('/')
      } else {
        setError(data.message || "Invalid email or password")
      }       
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4">Login Required</h2>
        
        <form onSubmit={handleLogin} class="space-y-4" autocomplete="on">
          <Show when={error()}>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error()}
            </div>
          </Show>
          
          <div>
            <label class="block text-gray-700 mb-2" for="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={loading()}
              autocomplete="username"
            />
          </div>
          
          <div>
            <label class="block text-gray-700 mb-2" for="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password()}
              onInput={(e) => setPassword(e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={loading()}
              autocomplete="current-password"
            />
          </div>
          
          <button
            type="submit"
            class="w-full bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-sky-700 transition-colors"
            disabled={loading()}
          >
            {loading() ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}