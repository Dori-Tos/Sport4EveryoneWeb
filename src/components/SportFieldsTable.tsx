import { For, createSignal } from "solid-js"
import { Show } from "solid-js/web"
import { useAuth } from "~/lib/auth"
import { MainCentered } from "./Main"
import { TableCentered } from "./MainTable"
import { addSportFieldAction } from "~/lib/sportFields"

type SportFieldsTableProps = {
  userSportCenters: () => Array<any>
  userSportFields: () => Array<any>
  sports: () => Array<any>
  onChange: () => void
}

export default function SportFieldTable(props: SportFieldsTableProps) {
  const { currentUser } = useAuth()

  const [selectedSportsCenterId, setSelectedSportsCenterId] = createSignal("")
  const [newSportFieldName, setNewSportFieldName] = createSignal("")
  const [newSportFieldPrice, setNewSportFieldPrice] = createSignal(10)
  const [selectedSports, setSelectedSports] = createSignal<number[]>([])
  const [formError, setFormError] = createSignal("")
  const [isFormVisible, setIsFormVisible] = createSignal(false)

  const handleAddSportField = async (e: Event) => {
    e.preventDefault()
    setFormError("")
    
    try {
      if (!currentUser()?.id) {
        setFormError("You must be logged in")
        return
      }

      if (!selectedSportsCenterId()) {
        setFormError("Please select a sports center")
        return
      }
      
      if (!newSportFieldName()) {
        setFormError("Please enter a name for the sport field")
        return
      }

      const formData = new FormData()
      formData.append("name", newSportFieldName())
      formData.append("price", newSportFieldPrice().toString())
      
      // Add selected sports
      selectedSports().forEach(sportId => {
        formData.append("sports", sportId.toString())
      })
      
      // Add sports center relation
      formData.append("sportsCenterId", selectedSportsCenterId())

      const response = await fetch("/api/sportfields/", {
        method: "POST",
        body: formData
      })
      
      if (!response.ok) {
        throw new Error("Failed to add sport field")
      }
      
      // Reset form
      setNewSportFieldName("")
      setNewSportFieldPrice(10)
      setSelectedSports([])
      setIsFormVisible(false)
      
      // Notify parent to update data
      props.onChange()
    }
    catch (error) {
      console.error("Failed to add sport field:", error)
      setFormError(error.message || "Failed to add sport field")
    }
  }
  
  const handleRemoveSportField = async (sportFieldId: number) => {
    try {
      if (!currentUser()?.id) return

      const response = await fetch(`/api/sportfields/${sportFieldId}`, {
        method: "DELETE"
      })
      
      if (!response.ok) {
        throw new Error("Failed to remove sport field")
      }
      
      props.onChange()
    } catch (error) {
      console.error("Failed to remove sport field:", error)
    }
  }

  const toggleSportSelection = (sportId: number) => {
    const currentSelection = selectedSports()
    if (currentSelection.includes(sportId)) {
      setSelectedSports(currentSelection.filter(id => id !== sportId))
    } else {
      setSelectedSports([...currentSelection, sportId])
    }
  }

  return (
    <MainCentered>
      <div class="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">Sport Fields Management</h2>
          <button
            onClick={() => setIsFormVisible(!isFormVisible())}
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isFormVisible() ? "Cancel" : "Add New Sport Field"}
          </button>
        </div>

        {/* Add Sport Field Form */}
        <Show when={isFormVisible()}>
          <form onSubmit={handleAddSportField} class="mb-8 border p-4 rounded-md bg-gray-50">
            <h3 class="font-semibold mb-4">Add New Sport Field</h3>
            
            <Show when={formError()}>
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {formError()}
              </div>
            </Show>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Sports Center
                </label>
                <select
                  value={selectedSportsCenterId()}
                  onChange={(e) => setSelectedSportsCenterId(e.target.value)}
                  class="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a Sports Center</option>
                  <For each={props.userSportCenters()}>
                    {(center) => (
                      <option value={center.id}>{center.name}</option>
                    )}
                  </For>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Field Name
                </label>
                <input
                  type="text"
                  value={newSportFieldName()}
                  onInput={(e) => setNewSportFieldName(e.target.value)}
                  class="w-full p-2 border rounded"
                  placeholder="e.g. Tennis Court 1"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Price per Hour (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newSportFieldPrice()}
                  onInput={(e) => setNewSportFieldPrice(Number(e.target.value))}
                  class="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Available Sports
                </label>
                <div class="p-2 border rounded max-h-32 overflow-y-auto">
                  <For each={props.sports()}>
                    {(sport) => (
                      <div class="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`sport-${sport.id}`}
                          checked={selectedSports().includes(sport.id)}
                          onChange={() => toggleSportSelection(sport.id)}
                          class="mr-2"
                        />
                        <label for={`sport-${sport.id}`}>{sport.name}</label>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Sport Field
              </button>
            </div>
          </form>
        </Show>

        {/* Sport Fields Table */}
        <TableCentered>
          <Show when={props.userSportFields().length > 0} fallback={<p>No sport fields found. Create one using the form above.</p>}>
            <table class="min-w-full bg-white">
              <thead>
                <tr>
                  <th class="py-2 px-4 border-b">Field Name</th>
                  <th class="py-2 px-4 border-b">Sports Center</th>
                  <th class="py-2 px-4 border-b">Price/Hour</th>
                  <th class="py-2 px-4 border-b">Sports</th>
                  <th class="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                <For each={props.userSportFields()}>
                  {(field) => (
                    <tr class="border-t hover:bg-gray-100">
                      <td class="py-2 px-4 border-b">{field.name}</td>
                      <td class="py-2 px-4 border-b">{field.SportsCenter?.name || "Not assigned"}</td>
                      <td class="py-2 px-4 border-b">{field.price}€</td>
                      <td class="py-2 px-4 border-b">
                        <div class="flex flex-wrap gap-1">
                          <For each={field.sports}>
                            {(sport) => (
                              <span class="bg-gray-200 px-2 py-1 text-xs rounded-full">
                                {sport.name}
                              </span>
                            )}
                          </For>
                        </div>
                      </td>
                      <td class="py-2 px-4 border-b">
                        <button
                          onClick={() => handleRemoveSportField(field.id)}
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
  )
}