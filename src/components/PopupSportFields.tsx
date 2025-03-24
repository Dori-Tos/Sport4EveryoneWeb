import { For, createSignal } from "solid-js"
import { MainCentered } from "./Main"
import { ReservationSaveItem, SportFieldsItem } from "~/components/Items"
import { addReservationAction } from "~/lib/reservations"
import { useAuth } from "~/lib/auth"

type PopupProps = {
  data: Array<SportFieldsItem>
  centerName: string | undefined
  centerId: number | undefined
  onClose: () => void
  onSave: (reservations: ReservationSaveItem[]) => void
}

export function PopupSportFields(props: PopupProps) {
  const { currentUser, refreshUser } = useAuth()
  const [selectedDate, setSelectedDate] = createSignal('2025-01-01')
  const [startTime, setStartTime] = createSignal('10:00')
  const [endTime, setEndTime] = createSignal('11:00')
  const [selectedCheckboxes, setSelectedCheckboxes] = createSignal<number[]>([])

  const handleCheckboxesChange = (id: number) => {
    setSelectedCheckboxes((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fieldId) => fieldId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleSave = async () => {
    if (currentUser() !== null) {
      const reservations = await Promise.all(
        selectedCheckboxes().map(async (selectedFieldId) => {
          const field = props.data.find((field) => field.id === selectedFieldId)
          const price = field ? field.price : 0

          const formData = new FormData()
          formData.append('userID', currentUser().id.toString())
          formData.append('sportCenterID', props.centerId.toString())
          formData.append('sportFieldID', selectedFieldId.toString())
          formData.append('startDateTime', selectedDate())
          formData.append('duration', `${startTime()} - ${endTime()}`)
          formData.append('price', price.toString())
          
          const reservation = await addReservationAction(formData)
          console.log('Reservation:', reservation)
          return reservation
          })
      )
      await refreshUser()
      props.onSave(reservations)
      props.onClose()
    }
  }

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-4 rounded-md w-1/2">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">
            Sport Fields for {props.centerName}
          </h2>
          <button class="text-red-500" onClick={props.onClose}>
            Close
          </button>
        </div>
        <div>
          <h3 class="text-lg font-bold mb-2">Reservation</h3>
        </div>
        <div class="flex items-center mb-4">
            <label class="block mb-4 font-semibold mr-4 w-100">Select Date:</label>
            <input
              type="date"
              id="datepicker-custom"
              class="form-input w-100"
              value={selectedDate()}
              onInput={(e) => setSelectedDate(e.currentTarget.value)}
            />
          </div>
          <div class="flex items-center mb-4">
            <label class="block mb-4 font-semibold mr-4 w-100">Start Time:</label>
            <input
              type="time"
              id="start-timepicker-custom"
              class="form-input w-full"
              value={startTime()}
              onInput={(e) => setStartTime(e.currentTarget.value)}
            />
            <label class="block mb-4 font-semibold mr-4 w-100">End Time:</label>
            <input
              type="time"
              id="end-timepicker-custom"
              class="form-input w-full"
              value={endTime()}
              onInput={(e) => setEndTime(e.currentTarget.value)}
            />
        </div>
        {props.data.length > 0 ? (
          <div class="border border-gray-300 rounded-md p-2">
          <div class="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
            <span class="w-1/12"></span>
            <span class="w-7/12 font-semibold">SportField Name</span>
            <span class="w-4/12 font-semibold">Price</span>
          </div>
          <ul>
            <For each={props.data}>
              {(field: SportFieldsItem) => (
                <li class="mb-2">
                  <div class="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
                    <input
                      type="checkbox"
                      class="mr-2 w-1/12"
                      checked={selectedCheckboxes().includes(field.id)}
                      onChange={() => handleCheckboxesChange(field.id)}
                    />
                    <span class="w-7/12 font-semibold">{field.name}</span>
                    <span class="w-4/12 text-gray-600">{field.price}€/h</span>
                  </div>
                </li>
              )}
            </For>
          </ul>
        </div>
        ) : (
          <p>No sport fields available.</p>
        )}
        <div class="flex justify-end mt-4">
          <button class="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
