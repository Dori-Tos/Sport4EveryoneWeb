import { createSignal, Show } from "solid-js"
import { useSubmission } from "@solidjs/router"
import { useAuth } from "~/lib/auth"
import { addContactAction } from "~/lib/contacts"

type ContactSearchBarProps = {
    onContactAdded: () => void
}

export default function ContactSearchBar(props: ContactSearchBarProps) {
  const { currentUser } = useAuth()
  const [searchTerm, setSearchTerm] = createSignal("")
  const [searchResults, setSearchResults] = createSignal<any[]>([])
  const [isSearching, setIsSearching] = createSignal(false)
  const [error, setError] = createSignal("")
  const addSubmission = useSubmission(addContactAction)
  
  // Search users with debounce
  let debounceTimeout: number | undefined

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  
    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    if (value.length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Set new timeout for 300ms to reduce API calls while typing
    debounceTimeout = setTimeout(async () => {
      try {
        // Use the contacts API endpoint instead of users/search
        const response = await fetch(`/api/contacts?term=${encodeURIComponent(value)}`)

        if (!response.ok) {
            throw new Error('Search failed')
        }

        const data = await response.json()

        // Filter out the current user and existing contacts
        setSearchResults(data.filter(user => 
          user.id !== currentUser()?.id && 
          !currentUser()?.contacts?.some(contact => contact.contactId === user.id)
        ))
      } catch (err) {
        console.error("Search error:", err)
        setError("Failed to search users")
      } finally {
        setIsSearching(false)
      }
    }, 300) as unknown as number
  }

  const handleAddContact = async (contactId: number) => {
    try {
      setError("")
      if (!currentUser()?.id) {
        setError("You must be logged in to add contacts")
        return
      }
      
      // Create a FormData object
      const formData = new FormData()
      formData.append("userId", currentUser().id.toString())
      formData.append("contactId", contactId.toString())
      
      // Use fetch directly if the action is failing
      const response = await fetch("/api/contacts/", {
        method: "POST",
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`Failed to add contact: ${response.statusText}`)
      }
      
      // Clear the search
      setSearchTerm("")
      setSearchResults([])
      
      // Notify parent component to refresh contacts list
      props.onContactAdded()
    } catch (err) {
      console.error("Add contact error:", err)
      setError("Failed to add contact")
    }
  }

  return (
    <div class="mb-6">
      <div class="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm()}
          onInput={(e) => handleSearch(e.currentTarget.value)}
          class="w-full p-2 border rounded"
        />
      </div>
      
      <Show when={error()}>
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error()}
        </div>
      </Show>
      
      <Show when={isSearching()}>
        <div class="text-gray-500 mb-4">Searching...</div>
      </Show>
      
      <Show when={searchResults().length > 0}>
        <div class="border rounded overflow-hidden">
          <ul class="divide-y divide-gray-200">
            {searchResults().map(user => (
              <li class="p-3 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p class="font-medium">{user.name}</p>
                  <p class="text-sm text-gray-600">{user.email}</p>
                </div>
                <button
                  onClick={() => handleAddContact(user.id)}
                  disabled={addSubmission.pending}
                  class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  {addSubmission.pending ? 'Adding...' : 'Add'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Show>
      
      <Show when={searchTerm().length >= 2 && searchResults().length === 0 && !isSearching()}>
        <div class="text-gray-500 mb-4">No users found matching your search.</div>
      </Show>
    </div>
  )
}