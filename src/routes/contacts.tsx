import { createAsyncStore, useNavigate } from "@solidjs/router"
import { createEffect } from "solid-js"
import { useAuth } from "~/lib/auth"
import { MainCentered } from "~/components/Main"
import { MainHeader } from "~/components/Header"
import ContactsTable from "~/components/ContactsTable"
import { getContactsByUser } from "~/lib/contacts"
import ContactSearchBar from "~/components/ContactSearchBar"

export default function Contacts() {
  const { currentUser, refreshUser, isLoading } = useAuth()
  const navigate = useNavigate()

  createEffect(() => {
    if (!isLoading() && !currentUser()) {
      // Redirect unauthenticated users to login (which will show the login popup)
      navigate('/login', { replace: true })
    }
  })

  let userContacts = createAsyncStore(async () => {
    if (!currentUser()?.id) return []
    
    return await getContactsByUser(currentUser()?.id)
  }, { initialValue: [] })

  const refreshContacts = async () => {
    if (!currentUser()?.id) return

    try {
      const contacts = await getContactsByUser(currentUser()?.id)
      userContacts = contacts
    } catch (error) {
      console.error("Failed to refresh contacts:", error)
    }
  }
  
  return (
    <MainCentered>
      <MainHeader string="Contacts Page"/>

      <div class="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mb-6">
        <h2 class="text-xl font-bold mb-4">Add New Contact</h2>
        <ContactSearchBar onContactAdded={refreshContacts} />
      </div>

      <ContactsTable userContacts={userContacts} onContactDeleted={refreshContacts}/>
    </MainCentered>
  )
}
