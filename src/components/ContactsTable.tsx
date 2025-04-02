import { For } from "solid-js"
import { Show } from "solid-js/web"
import { useAuth } from "~/lib/auth"
import { MainCentered } from "./Main"
import { TableCentered } from "./MainTable"
import { removeContactAction } from "~/lib/contacts"

type ContactsTableProps = {
  userContacts: () => Array<any>
  onContactDeleted: () => void
}

export default function ContactsTable(props: ContactsTableProps) {
  const { currentUser } = useAuth()
  
  const handleRemoveContact = async (contactId: number) => {
    try {
      if (!currentUser()?.id) return

      const formData = new FormData()
      formData.append("userId", currentUser().id.toString())
      formData.append("contactId", contactId.toString())
       
      const response = await fetch("/api/contacts/", {
        method: "DELETE",
        body: formData
      })
      if (!response.ok) {
        throw new Error("Failed to remove contact")
      }
      
      props.onContactDeleted()
    } catch (error) {
      console.error("Failed to remove contact:", error)
    }
  }

  return (
    <>
      <MainCentered>
        <div class="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <h2 class="text-xl font-bold mb-4">Your Contacts</h2>
          <TableCentered>
            <Show when={props.userContacts().length > 0} fallback={<p>No contacts found.</p>}>
              <table class="min-w-full bg-white">
                <thead>
                  <tr>
                    <th class="py-2 px-4 border-b">Contact Name</th>
                    <th class="py-2 px-4 border-b">Email</th>
                    <th class="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={props.userContacts()}>
                    {(contactRelation) => (
                      <tr class="border-t hover:bg-gray-100">
                        <td class="py-2 px-4 border-b">{contactRelation.contact?.name || "Unknown Contact"}</td>
                        <td class="py-2 px-4 border-b">{contactRelation.contact?.email || "No email"}</td>
                        <td class="py-2 px-4 border-b">
                          <button
                            onClick={() => handleRemoveContact(contactRelation.contactId)}
                            class="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </Show>
          </TableCentered>
        </div>
      </MainCentered>
    </>
  )
}
