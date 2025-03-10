import { createSignal, Show } from "solid-js"
import { useAuth } from "~/lib/auth"
import { updateUserAction } from "~/lib/users"

export default function EditProfilePopup({ onClose, onSave }) {
  const { currentUser, setCurrentUser } = useAuth()
  const [name, setName] = createSignal(currentUser().name)
  const [email, setEmail] = createSignal(currentUser().email)
  const [password, setPassword] = createSignal("")
  const [confirmPassword, setConfirmPassword] = createSignal("")
  const [error, setError] = createSignal("")
  const [loading, setLoading] = createSignal(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    // Validate passwords match if a new password is being set
    if (password() && password() !== confirmPassword()) {
      setError("Passwords do not match")
      return
    }
    
    try {
      setLoading(true)
      
      // Only include the fields we're actually updating
      const updateData = { 
        name: name(), 
        email: email(),
        password: password() || currentUser().password,
        administrator: currentUser().administrator,
        // // Include empty arrays for relationship fields since we're not modifying them
        // reservations: [],
        // contacts: [],
        // sportsCenters: []
      }
      
      // Call the updateUserAction with minimal parameters
      const result = await updateUserAction(currentUser().id, updateData)
      
      if (result) {
        // Create an updated user object without modifying the original
        const updatedUser = {
          ...currentUser(),
          name: name(),
          email: email()
        }
        
        // Update the current user in the auth context
        setCurrentUser(updatedUser)
        
        // Close the popup
        if (onSave) onSave()
      } else {
        setError("Failed to update profile. Please try again.")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(`Failed to update profile: ${err.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Edit Profile</h2>
        
        <Show when={error()}>
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error()}
          </div>
        </Show>
        
        <form onSubmit={handleSubmit}>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name()}
              onInput={(e) => setName(e.target.value)}
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.target.value)}
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">New Password (leave blank to keep current)</label>
            <input
              type="password"
              value={password()}
              onInput={(e) => setPassword(e.target.value)}
              class="w-full p-2 border rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.target.value)}
              class="w-full p-2 border rounded"
            />
          </div>
          <div class="flex justify-end">
            <button 
              type="button" 
              onClick={onClose} 
              class="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading()}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading()}
            >
              {loading() ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}