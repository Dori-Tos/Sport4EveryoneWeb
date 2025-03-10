import { createSignal } from "solid-js"
import { useAuth } from "~/lib/auth"

export default function LoginPopup() {
  const [email, setEmail] = createSignal("test@test.com")
  const [password, setPassword] = createSignal("test")
  const [error, setError] = createSignal("")
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    
    if (!email() || !password()) {
      setError("Please enter both email and password")
      return
    }
    
    const result = await login(email(), password())
    if (!result.success) {
      setError(result.message || "Login failed")
    }
  }

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4">Login Required</h2>
        
        <form onSubmit={handleLogin} class="space-y-4">
          {error() && (
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error()}
            </div>
          )}
          
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
            />
          </div>
          
          <button
            type="submit"
            class="w-full bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-sky-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}