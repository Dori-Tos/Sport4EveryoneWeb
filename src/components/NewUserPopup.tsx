import { createSignal, Show } from "solid-js"
import { useAuth } from "~/lib/auth"
import { useNavigate } from "@solidjs/router"
import { addUserAction } from "~/lib/users"

export default function LoginPopup() {
    const [name, setName] = createSignal("")
    const [email, setEmail] = createSignal("")
    const [password, setPassword] = createSignal("")
    const [confirmPassword, setConfirmPassword] = createSignal("")
    const [error, setError] = createSignal("")
    const [loading, setLoading] = createSignal(false)
    const navigate = useNavigate()

    const handleSignup = async (e: { preventDefault: () => void }) => {
      e.preventDefault()
    }

    return (
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 class="text-2xl font-bold mb-4">Login Required</h2>

          <form onSubmit={handleSignup} class="space-y-4" autocomplete="on">
            <Show when={error()}>
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error()}
              </div>
            </Show>

            <div>
              <label class="block text-gray-700 mb-2" for="email">
                Name
              </label>
              <input
                id="name"
                value={name()}
                onInput={(e) => setName(e.target.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                disabled={loading()}
                autocomplete="username"
              />
            </div>

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
                autocomplete="email"
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

            <div>
            <label class="block text-gray-700 mb-2" for="password">
                Confirm Password
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