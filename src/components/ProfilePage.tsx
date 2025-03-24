import { createSignal, Show, For, createResource, createEffect} from "solid-js"
import { MainCentered } from "~/components/Main"
import { MainHeader, MediumHeader } from "~/components/Header"
import { TableCentered } from "~/components/MainTable"
import { useAuth } from "~/lib/auth"
import { getUser } from "~/lib/users"
import EditProfilePopup from "~/components/EditProfilePopup"

export default function ProfilePage() {
  const { currentUser, refreshUser } = useAuth()
  const [showPopup, setShowPopup] = createSignal(false)
  
  // Use createResource to fetch the latest user data from the server
  const [userData, { refetch }] = createResource(getUser)
  
  // Update the current user when userData changes
  const handleUserDataUpdate = () => {
    if (userData() && !userData.loading) {
      refreshUser()
    }
  }
  
  // Monitor userData for changes
  createEffect(() => {
    if (userData()) {
      handleUserDataUpdate()
    }
  })

  const handleSave = () => {
    setShowPopup(false)
    // Refresh user data from the server
    refetch()
  }

  return (
    <>
      <Show when={currentUser()} fallback={<p>Loading profile data...</p>}>
        <div class="mb-6 bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <div class="mb-6 flex justify-between items-center">
            <MediumHeader string="Personal Information" />
            <button
              onClick={() => setShowPopup(true)}
              class="bg-blue-600 text-white px-3 py-1 rounded-md"
            >
              Modify
            </button>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="text-gray-600">Name:</div>
            <div class="font-medium">{currentUser().name}</div>
            
            <div class="text-gray-600">Email:</div>
            <div class="font-medium">{currentUser().email}</div>
            
            <div class="text-gray-600">Account Type:</div>
            <div class="font-medium">
              {currentUser().administrator ? "Administrator" : "Regular User"}
            </div>
          </div>
        </div>
        <div class="mb-6 bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <div class="mb-6">
            <MediumHeader string="Reservations" />
            <Show 
              when={currentUser().reservations && currentUser().reservations.length > 0}
              fallback={<p class="text-gray-500 italic mt-3">No reservations found.</p>}
            >
              <TableCentered>
                <table class="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th class="py-2 px-4 border-b">Date</th>
                      <th class="py-2 px-4 border-b">Time</th>
                      <th class="py-2 px-4 border-b">Location</th>
                      <th class="py-2 px-4 border-b">SportField</th>
                      <th class="py-2 px-4 border-b">Sport</th>
                      <th class="py-2 px-4 border-b">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={currentUser().reservations}>
                      {(reservation) => (
                        <tr>
                          <td class="py-2 px-4 border-b">{reservation.date}</td>
                          <td class="py-2 px-4 border-b">{reservation.time}</td>
                          <td class="py-2 px-4 border-b">{reservation.sportCenter?.name || "N/A"}</td>
                          <td class="py-2 px-4 border-b">{reservation.sportField?.name || "N/A"}</td>
                          <td class="py-2 px-4 border-b">{reservation.sportField?.sport?.name || "N/A"}</td>
                          <td class="py-2 px-4 border-b">{reservation.price || "N/A"}</td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </TableCentered>
            </Show>
          </div>
                    
          <div>
            <MediumHeader string="Contacts" />
            <Show 
              when={currentUser().contacts && currentUser().contacts.length > 0}
              fallback={<p class="text-gray-500 italic mt-3">No contacts found.</p>}
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <For each={currentUser().contacts}>
                  {(contactRelation) => (
                    <div class="bg-gray-50 p-3 rounded-md">
                      <div class="font-medium">{contactRelation.contact?.name || "Unknown Contact"}</div>
                      <div class="text-gray-600 text-sm">{contactRelation.contact?.email || "No email"}</div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </Show>
      <Show when={showPopup()}>
        <EditProfilePopup 
          onClose={() => setShowPopup(false)} 
          onSave={handleSave} 
        />
      </Show>
    </>
  )
}