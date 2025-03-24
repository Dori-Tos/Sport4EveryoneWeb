import { createSignal, Show } from "solid-js"
import { useAuth } from "~/lib/auth"
import { useNavigate, useSubmission } from "@solidjs/router"
import { addUserAction } from "~/lib/users"

interface RegisterPopupProps {
  onSwitchToLogin: () => void;
}

export default function RegisterPopup({ onSwitchToLogin }: RegisterPopupProps) {
  const [name, setName] = createSignal("")
  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [confirmPassword, setConfirmPassword] = createSignal("")
  const [error, setError] = createSignal("")
  const navigate = useNavigate()
  const submission = useSubmission(addUserAction)

  const isFormValid = () => {
    return (
      name() && 
      email() &&
      password() &&
      password() === confirmPassword()
    )
  }

  const handleSubmit = (e) => {
    // Validate form before submitting
    if (!isFormValid()) {
      e.preventDefault()
      
      if (!name()) {
        setError("Name is required")
      } else if (!email()) {
        setError("Email is required")
      } else if (!password()) {
        setError("Password is required")
      } else if (password() !== confirmPassword()) {
        setError("Passwords do not match")
      }
      return false
    }
    
    setError("")
    return true
  }
    
  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Create Account</h2>
        
        <Show when={error()}>
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error()}
          </div>
        </Show>
        
        <form 
          method="post" 
          action={addUserAction}
          onSubmit={handleSubmit}
          class="space-y-4"
        >
          
          <div>
            <label class="block text-gray-700 mb-2" for="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name()}
              onInput={(e) => setName(e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={submission.pending}
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-2" for="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={submission.pending}
              autocomplete="email"
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-2" for="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password()}
              onInput={(e) => setPassword(e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={submission.pending}
              autocomplete="new-password"
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-2" for="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={submission.pending}
              autocomplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            disabled={!isFormValid() || submission.pending}
          >
            {submission.pending ? 'Creating Account...' : 'Sign Up'}
          </button>
          
          <div class="text-center mt-4">
            <p class="text-gray-600">
              Already have an account?{" "}
              <button 
                type="button"
                onClick={onSwitchToLogin} 
                class="text-blue-600 hover:underline"
                disabled={submission.pending}
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}