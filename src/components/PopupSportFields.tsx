import { For, createSignal } from "solid-js"
import { MainCentered } from "./Main"
import { ReservationItem, SportFieldsItem } from "~/components/Items"

type PopupProps = {
  data: Array<SportFieldsItem>
  centerName: string | undefined
  centerId: number | undefined
  onClose: () => void
  onSave: (reservation: ReservationItem) => void
};

export function PopupSportFields(props: PopupProps) {
  const [selectedDate, setSelectedDate] = createSignal('2025-01-01')
  const [startTime, setStartTime] = createSignal('10:00');
  const [endTime, setEndTime] = createSignal('11:00');
  const [selectedCheckboxes, setSelectedCheckboxes] = createSignal<number[]>([])

  const handleCheckboxesChange = (id: number) => {
    setSelectedCheckboxes((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fieldId) => fieldId !== id)
      } else {
        return [...prev, id]
      }
    });
  };

  const handleSave = () => {
    const reservation: ReservationItem = {
      date: selectedDate(),
      time: `${startTime()} - ${endTime()}`,
      sportFieldIds: selectedCheckboxes(),
      sportCenterId: 1,
      userId: 1,
    }
    props.onSave(reservation)
    props.onClose()
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
          <ul class="list-disc ml-6">
            <For each={props.data}>
              {(field: SportFieldsItem) => (
                <li class="mb-2">
                  <div class="flex justify-between items-center">
                    <input
                      type="checkbox"
                      class="mr-2"
                      checked={selectedCheckboxes().includes(field.id)}
                      onChange={() => handleCheckboxesChange(field.id)}
                    />
                    <span class="font-semibold">{field.name}</span>
                    <span class="text-gray-600">{field.price}€/h</span>
                  </div>
                </li>
              )}
            </For>
          </ul>
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
